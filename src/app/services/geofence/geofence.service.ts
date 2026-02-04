import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CordovaService } from '../cordova.service';
import {
  GeofenceIdentifierInfo,
  GeofenceIdentifierService,
} from './geofence-identifier.service';
import { GeofenceNotificationService } from './geofence-notification.service';
import { GeofencePermissionsService } from './geofence-permissions.service';
import { UtmRoutesService } from '../utm-routes.service';
import { UtmRoute } from '../../models/utm-route';
import { UtmRouteStop } from '../../models/utm-route-stop';

import type {
  AuthorizationStatus,
  Config,
  Geofence as BgGeofence,
  GeofenceEvent,
  ProviderChangeEvent,
  State,
} from 'cordova-background-geolocation-lt';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

@Injectable({
  providedIn: 'root',
})
export class GeofenceService {
  private bgGeo: BgGeo | undefined;
  private initialized = false;
  private readyInvoked = false;
  private initializingPromise: Promise<boolean> | undefined;
  private listenersRegistered = false;
  private routeSub: Subscription | undefined;
  private stopsLoadedSub: Subscription | undefined;

  private routeNotificationsEnabled = false;

  private readonly enabledSubject = new BehaviorSubject<boolean>(false);
  public readonly enabled$ = this.enabledSubject.asObservable();

  private readonly locationPermissionOkSubject = new BehaviorSubject<boolean>(
    false
  );
  public readonly locationPermissionOk$ =
    this.locationPermissionOkSubject.asObservable();

  private readonly activeGeofencesSubject = new BehaviorSubject<BgGeofence[]>(
    []
  );
  public readonly activeGeofences$ = this.activeGeofencesSubject.asObservable();

  private lastActiveGeofences: BgGeofence[] = [];

  private activeRouteId: string | undefined;

  constructor(
    private cordova: CordovaService,
    private utmRoutes: UtmRoutesService,
    private geofenceIdentifier: GeofenceIdentifierService,
    private geofenceNotifications: GeofenceNotificationService,
    private geofencePermissions: GeofencePermissionsService,
    private zone: NgZone
  ) {}

  private getGeofenceInfoFromIdentifier(
    identifier: string | undefined
  ): GeofenceIdentifierInfo | undefined {
    return this.geofenceIdentifier.getInfoFromIdentifier(
      identifier,
      this.lastActiveGeofences
    );
  }

  private async startGeofencingEngine(): Promise<void> {
    if (!this.bgGeo) {
      return;
    }

    try {
      await this.bgGeo.startGeofences();
    } catch (e) {
      console.warn('[GeofenceService] startGeofencingEngine failed', e);
    }
  }

  private setEnabled(value: boolean): void {
    this.zone.run(() => this.enabledSubject.next(value));
  }

  private setLocationPermissionOk(value: boolean): void {
    this.zone.run(() => this.locationPermissionOkSubject.next(value));
  }

  private setActiveGeofences(value: BgGeofence[]): void {
    this.lastActiveGeofences = value;
    this.zone.run(() => this.activeGeofencesSubject.next(value));
  }

  private async refreshActiveGeofences(): Promise<void> {
    if (!this.initialized || !this.bgGeo) {
      this.setActiveGeofences([]);
      return;
    }

    try {
      const fences = await this.bgGeo.getGeofences();
      this.setActiveGeofences(fences ?? []);
    } catch {
      this.setActiveGeofences([]);
    }
  }

  public async setRouteNotificationsEnabled(
    enabled: boolean
  ): Promise<boolean> {
    if (enabled) {
      if (this.routeNotificationsEnabled) {
        return this.enabledSubject.getValue();
      }

      console.log('[GeofenceService] enabling route notifications geofencing');
      const ok = await this.ensureInitialized();
      if (!ok) {
        console.warn(
          '[GeofenceService] enabling route notifications failed: plugin not initialized'
        );
        this.setEnabled(false);
        this.setActiveGeofences([]);
        return false;
      }

      const hasLocationPermission = await this.checkHasLocationPermission();
      if (!hasLocationPermission) {
        console.warn(
          '[GeofenceService] enabling route notifications failed: permissions not authorized'
        );
        this.setEnabled(false);
        this.setActiveGeofences([]);
        await this.disableGeofencing();
        return false;
      }

      // If the user previously disabled geofencing, the plugin may have been stopped.
      // Start it again on every enable.
      await this.startGeofencingEngine();

      // Only now consider the feature enabled.
      this.routeNotificationsEnabled = true;
      this.initSubscriptions();

      this.setEnabled(true);

      return true;
    }

    if (!this.routeNotificationsEnabled) {
      this.setEnabled(false);
      return true;
    }

    this.routeNotificationsEnabled = false;

    console.log('[GeofenceService] disabling route notifications geofencing');
    this.teardownSubscriptions();
    await this.disableGeofencing();

    this.setEnabled(false);
    this.setActiveGeofences([]);

    return true;
  }

  public async checkHasLocationPermission(): Promise<boolean> {
    if (!this.bgGeo) {
      return false;
    }

    const ok = await this.geofencePermissions.hasLocationPermission(this.bgGeo);
    this.setLocationPermissionOk(ok);

    if (!ok && this.routeNotificationsEnabled) {
      console.warn(
        '[GeofenceService] location permission not granted; disabling route notifications'
      );
      void this.setRouteNotificationsEnabled(false);
    }

    return ok;
  }

  private initSubscriptions(): void {
    if (this.routeSub || this.stopsLoadedSub) {
      return;
    }

    this.routeSub = this.utmRoutes.selected.subscribe((route) => {
      if (!this.routeNotificationsEnabled) {
        return;
      }

      void this.handleRouteChanged(route);
    });

    this.stopsLoadedSub = this.utmRoutes.selectedRouteLocationsLoaded.subscribe(
      () => {
        if (!this.routeNotificationsEnabled) {
          return;
        }

        void this.handleStopsPossiblyLoaded(this.utmRoutes.selected.getValue());
      }
    );
  }

  private teardownSubscriptions(): void {
    this.routeSub?.unsubscribe();
    this.routeSub = undefined;

    this.stopsLoadedSub?.unsubscribe();
    this.stopsLoadedSub = undefined;
  }

  private async getPlugin(timeoutMs = 5000): Promise<BgGeo | undefined> {
    const ready = await this.cordova.ready(timeoutMs);
    if (!ready) return undefined;

    const w = window as any;
    const plugin = w?.BackgroundGeolocation as BgGeo | undefined;

    if (!plugin) {
      console.warn(
        '[GeofenceService] BackgroundGeolocation plugin not found on window. Is cordova-background-geolocation-lt installed and built?'
      );
      return undefined;
    }

    return plugin;
  }

  private async ensureInitialized(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    this.initializingPromise = (async (): Promise<boolean> => {
      const plugin = await this.getPlugin();
      if (!plugin) {
        console.warn(
          '[GeofenceService] ensureInitialized: no plugin available'
        );
        return false;
      }

      this.bgGeo = plugin;

      try {
        if (this.readyInvoked) {
          console.warn(
            '[GeofenceService] ensureInitialized: ready was already invoked earlier in this app session; will not call ready() again'
          );
        }

        if (!this.listenersRegistered) {
          this.listenersRegistered = true;

          plugin.onProviderChange((event: ProviderChangeEvent) => {
            if (!this.routeNotificationsEnabled) {
              return;
            }

            void this.checkHasLocationPermission();
          });

          // Listen for geofence events
          plugin.onGeofence(async (event: GeofenceEvent) => {
            const identifier = event?.identifier;
            const action = event?.action;

            if (action === 'ENTER' || action === 'EXIT') {
              console.log('[GeofenceService] geofence event', {
                action,
                identifier,
              });
            }

            try {
              await this.geofenceNotifications.handleGeofenceEvent(event, {
                routeNotificationsEnabled: this.routeNotificationsEnabled,
                getInfoFromIdentifier: (id) =>
                  this.getGeofenceInfoFromIdentifier(id),
              });
            } catch (e) {
              console.warn(
                '[GeofenceService] geofence notification handler failed',
                e
              );
            }
          });

          plugin.onLocation(
            () => {
              // Intentionally ignored
            },
            (error) => {
              console.warn('[GeofenceService] onLocation error', error);
            }
          );
        }

        if (!this.readyInvoked) {
          this.readyInvoked = true;

          const config: Config = {
            debug: false,
            logLevel: plugin.LOG_LEVEL_ERROR,
            desiredAccuracy: plugin.DESIRED_ACCURACY_HIGH,
            distanceFilter: 25,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            geofenceModeHighAccuracy: true,
            geofenceInitialTriggerEntry: false,
            // iOS: allow background location. Android: ACCESS_BACKGROUND_LOCATION permission
            locationAuthorizationRequest: 'Always',
            backgroundPermissionRationale: {
              title: 'Locatie in de achtergrond',
              message:
                "Utrecht Time Machine gebruikt je locatie om meldingen te sturen als je een routepunt nadert. Om dit te laten werken, moet je 'Altijd' locatie‑toegang inschakelen in de instellingen.",
              positiveAction: 'Ok',
              negativeAction: 'Niet nu',
            },
          };

          await plugin.ready(config);
        } else {
          console.log(
            '[GeofenceService] skipping BackgroundGeolocation.ready because it was already invoked'
          );
        }

        // Request permission explicitly; abort initialization if not granted.
        try {
          const permissionResult: AuthorizationStatus =
            await plugin.requestPermission();

          if (
            permissionResult === plugin.AUTHORIZATION_STATUS_DENIED ||
            permissionResult === plugin.AUTHORIZATION_STATUS_NOT_DETERMINED
          ) {
            console.warn(
              '[GeofenceService] requestPermission returned non-authorized status; aborting init',
              { permissionResult }
            );
            return false;
          }
        } catch (status) {
          console.warn(
            '[GeofenceService] requestPermission FAILURE (post-ready)',
            status
          );
          return false;
        }

        // Engage geofences-only mode (per docs) since we only need geofence events
        await plugin.startGeofences();

        this.initialized = true;
        return true;
      } catch (e) {
        console.error('[GeofenceService] ensureInitialized failed', e);
        return false;
      }
    })();

    try {
      return await this.initializingPromise;
    } finally {
      this.initializingPromise = undefined;
    }
  }

  private async handleRouteChanged(route: UtmRoute | undefined): Promise<void> {
    if (!this.routeNotificationsEnabled) {
      return;
    }

    if (!route) {
      this.activeRouteId = undefined;
      await this.clearAllGeofences();
      return;
    }

    this.activeRouteId = route.nid;

    // If stops already loaded, create fences immediately
    if (route.stops?.length) {
      await this.setGeofencesForRoute(route, 'route_changed_stops_present');
      return;
    }
  }

  private async handleStopsPossiblyLoaded(
    route: UtmRoute | undefined
  ): Promise<void> {
    if (!this.routeNotificationsEnabled) {
      return;
    }

    if (!route) {
      return;
    }

    // Ensure the event matches the currently active route
    if (this.activeRouteId && route.nid !== this.activeRouteId) {
      return;
    }

    if (!route.stops?.length) {
      console.warn(
        '[GeofenceService] handleStopsPossiblyLoaded: event fired but route has no stops',
        { routeId: route.nid }
      );
      return;
    }

    await this.setGeofencesForRoute(route);
  }

  private async clearAllGeofences(): Promise<void> {
    // Do not initialize the plugin just to clear fences
    if (!this.initialized || !this.bgGeo) {
      this.setActiveGeofences([]);
      return;
    }

    try {
      await this.bgGeo.removeGeofences();
      this.setActiveGeofences([]);
    } catch (e) {
      console.error('[GeofenceService] clearAllGeofences failed', e);
      this.setActiveGeofences([]);
    }
  }

  private async setGeofencesForRoute(route: UtmRoute) {
    if (!this.routeNotificationsEnabled) {
      return;
    }

    const ok = await this.ensureInitialized();
    if (!ok || !this.bgGeo) {
      console.warn('[GeofenceService] setGeofencesForRoute: not initialized');
      return;
    }

    await this.clearAllGeofences();

    const stops = route.stops ?? [];

    const geofences: BgGeofence[] = [];
    for (let idx = 0; idx < stops.length; idx++) {
      const stop: UtmRouteStop = stops[idx];
      const coords = stop.location?.coords;
      const lat = coords?.lat;
      const lng = coords?.lng;

      const identifier = this.geofenceIdentifier.buildRouteStopIdentifier(
        route.nid,
        idx,
        stop.location_id
      );

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        console.warn(
          '[GeofenceService] stop has no coords; skipping geofence',
          {
            identifier,
            idx,
            locationId: stop.location_id,
            location: stop.location,
          }
        );
        continue;
      }

      // TODO: tweak radius
      const radius = 80;

      const geofence: BgGeofence = {
        identifier,
        radius,
        latitude: lat,
        longitude: lng,
        notifyOnEntry: true,
        notifyOnExit: false,
        notifyOnDwell: false,
        extras: {
          routeId: route.nid,
          routeTitle: route.title,
          stopIdx: idx,
          locationId: stop.location_id,
          title: stop.title,
        },
      };

      geofences.push(geofence);
    }

    if (!geofences.length) {
      console.warn('[GeofenceService] No valid geofences to add', {
        routeId: route.nid,
        totalStops: stops.length,
      });
      return;
    }

    try {
      await this.bgGeo.addGeofences(geofences);
      void this.refreshActiveGeofences();
    } catch (e) {
      console.error('[GeofenceService] addGeofences failed', e);
      void this.refreshActiveGeofences();
    }
  }

  private async disableGeofencing(): Promise<void> {
    if (!this.initialized || !this.bgGeo) {
      this.setActiveGeofences([]);
      return;
    }

    try {
      await this.bgGeo.removeGeofences();
    } catch (e) {
      console.warn(
        '[GeofenceService] disableGeofencing removeGeofences failed',
        e
      );
    }

    await this.refreshActiveGeofences();

    try {
      await this.bgGeo.stop();
    } catch (e) {
      console.warn('[GeofenceService] disableGeofencing stop failed', e);
    }
  }
}
