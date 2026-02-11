import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CordovaService } from '../cordova.service';
import { PushNotificationPermissionsService } from '../push-notifications/push-notification-permissions.service';
import { GeofenceIdentifierService } from './geofence-identifier.service';
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
  GeofencesChangeEvent,
  ProviderChangeEvent,
  State,
} from 'cordova-background-geolocation-lt';
import { RouteStopData } from 'src/app/models/route-stop-data';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

export type GeofenceState = {
  enabled: boolean;
  locationPermissionOk: boolean;
  activeGeofences: BgGeofence[];
};

@Injectable({
  providedIn: 'root',
})
export class GeofenceService {
  private bgGeo: BgGeo | undefined;
  private initialized = false;
  private initializingPromise: Promise<boolean> | undefined;
  private listenersRegistered = false;
  private routeSub: Subscription | undefined;
  private stopsLoadedSub: Subscription | undefined;

  private routeNotificationsEnabled = false;

  private readonly stateSubject = new BehaviorSubject<GeofenceState>({
    enabled: false,
    locationPermissionOk: false,
    activeGeofences: [],
  });

  public readonly state$ = this.stateSubject.asObservable();

  private activeRouteId: string | undefined;

  constructor(
    private cordova: CordovaService,
    private utmRoutes: UtmRoutesService,
    private geofenceIdentifier: GeofenceIdentifierService,
    private geofenceNotifications: GeofenceNotificationService,
    private geofencePermissions: GeofencePermissionsService,
    private pushNotificationPermissions: PushNotificationPermissionsService,
    private zone: NgZone,
  ) {}

  private getGeofenceDataFromIdentifier(identifier: string | undefined): RouteStopData | undefined {
    return this.geofenceIdentifier.getDataFromIdentifier(
      identifier,
      this.stateSubject.getValue().activeGeofences,
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

  private updateState(value: Partial<GeofenceState>): void {
    this.zone.run(() =>
      this.stateSubject.next({
        ...this.stateSubject.getValue(),
        ...value,
      }),
    );
  }

  private async refreshActiveGeofences(): Promise<void> {
    if (!this.initialized || !this.bgGeo) {
      this.updateState({ activeGeofences: [] });
      return;
    }

    try {
      const fences = await this.bgGeo.getGeofences();
      this.updateState({ activeGeofences: fences ?? [] });
    } catch {
      this.updateState({ activeGeofences: [] });
    }
  }

  public async setRouteNotificationsEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      if (this.routeNotificationsEnabled) {
        return this.stateSubject.getValue().enabled;
      }

      console.log('[GeofenceService] enabling route notifications geofencing');
      const ok = await this.ensureInitialized();
      if (!ok) {
        console.warn(
          '[GeofenceService] enabling route notifications failed: plugin not initialized',
        );
        this.updateState({ enabled: false, activeGeofences: [] });
        return false;
      }

      const hasLocationPermission = await this.checkHasLocationPermission();
      if (!hasLocationPermission) {
        console.warn(
          '[GeofenceService] enabling route notifications failed: permissions not authorized',
        );
        this.updateState({ enabled: false, activeGeofences: [] });
        await this.disableGeofencing();
        return false;
      }

      const hasNotificationPermission = await this.pushNotificationPermissions.ensurePermission();
      if (!hasNotificationPermission) {
        console.warn(
          '[GeofenceService] enabling route notifications failed: notification permissions not authorized',
        );
        this.updateState({ enabled: false, activeGeofences: [] });
        await this.disableGeofencing();
        return false;
      }

      // If the user previously disabled geofencing, the plugin may have been stopped.
      // Start it again on every enable.
      await this.startGeofencingEngine();

      // Only now consider the feature enabled.
      this.routeNotificationsEnabled = true;
      this.initSubscriptions();

      this.updateState({ enabled: true });

      return true;
    }

    if (!this.routeNotificationsEnabled) {
      this.updateState({ enabled: false });
      return true;
    }

    this.routeNotificationsEnabled = false;

    console.log('[GeofenceService] disabling route notifications geofencing');
    this.teardownSubscriptions();
    await this.disableGeofencing();

    this.updateState({ enabled: false, activeGeofences: [] });

    return true;
  }

  public async checkHasLocationPermission(): Promise<boolean> {
    if (!this.bgGeo) {
      return false;
    }

    const ok = await this.geofencePermissions.hasLocationPermission(this.bgGeo);
    this.updateState({ locationPermissionOk: ok });

    if (!ok && this.routeNotificationsEnabled) {
      console.warn(
        '[GeofenceService] location permission not granted; disabling route notifications',
      );
      void this.setRouteNotificationsEnabled(false);
    }

    return ok;
  }

  private initSubscriptions(): void {
    if (this.routeSub || this.stopsLoadedSub) {
      return;
    }

    this.routeSub = this.utmRoutes.selected.subscribe(route => {
      if (!this.routeNotificationsEnabled) {
        return;
      }

      void this.handleRouteChanged(route);
    });

    this.stopsLoadedSub = this.utmRoutes.selectedRouteLocationsLoaded.subscribe(() => {
      if (!this.routeNotificationsEnabled) {
        return;
      }

      void this.handleStopsPossiblyLoaded(this.utmRoutes.selected.getValue());
    });
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
        '[GeofenceService] BackgroundGeolocation plugin not found on window. Is cordova-background-geolocation-lt installed and built?',
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
        console.warn('[GeofenceService] ensureInitialized: no plugin available');
        return false;
      }

      this.bgGeo = plugin;

      try {
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
            console.log('[GeofenceService] 🎯 Geofence event received:', {
              identifier: event?.identifier,
              action: event?.action,
              location: event?.location,
              timestamp: new Date().toISOString(),
            });

            const identifier = event?.identifier;
            const action = event?.action;

            if (action === 'ENTER' || action === 'EXIT') {
              console.log('[GeofenceService] geofence event', {
                identifier,
                action,
                location: event?.location,
              });
            }

            try {
              await this.geofenceNotifications.handleGeofenceEvent(event, {
                routeNotificationsEnabled: this.routeNotificationsEnabled,
                getDataFromIdentifier: id => this.getGeofenceDataFromIdentifier(id),
              });
            } catch (e) {
              console.warn('[GeofenceService] geofence notification handler failed', e);
            }
          });

          plugin.onLocation(
            location => {
              console.log('[GeofenceService] 📍 Location update:', {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                accuracy: location.coords.accuracy,
                timestamp: new Date().toISOString(),
                velocity: location.coords.speed,
                isMoving: location.is_moving,
              });
            },
            error => {
              console.warn('[GeofenceService] onLocation error', error);
            },
          );

          plugin.onMotionChange(location => {
            console.log('[GeofenceService] 🏃 Motion change:', {
              isMoving: location.isMoving,
              lat: location.location.coords.latitude,
              lng: location.location.coords.longitude,
              timestamp: new Date().toISOString(),
            });
          });

          plugin.onGeofencesChange((event: GeofencesChangeEvent) => {
            if (!this.routeNotificationsEnabled) {
              return;
            }

            if (event?.on || event?.off) {
              void this.refreshActiveGeofences();
            }
          });
        }

        const config: Config = {
          debug: true,
          logLevel: plugin.LOG_LEVEL_VERBOSE,
          desiredAccuracy: plugin.DESIRED_ACCURACY_HIGH,
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
          geofenceModeHighAccuracy: true,
          geofenceInitialTriggerEntry: false,
          stopTimeout: 5,
          disableStopDetection: true,
          disableMotionActivityUpdates: true,
          distanceFilter: 0,
          locationUpdateInterval: 2500, // Update every 2.5 seconds
          fastestLocationUpdateInterval: 1000, // Fastest possible updates
          forceReloadOnMotionChange: true,
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

        // Check if we need permissions
        try {
          const authorization = await plugin.requestPermission();
          console.log('[GeofenceService] 🔐 Permission result:', authorization);
        } catch (e) {
          console.log('[GeofenceService] Permission check failed:', e);
        }

        // Check if plugin is already running
        try {
          const state = await plugin.getState();
          console.log('[GeofenceService] 📊 Current plugin state:', state);

          if (state.enabled) {
            console.log('[GeofenceService] ✅ Plugin already running, skipping start');
            this.initialized = true;
            return true;
          }
        } catch (e) {
          console.log('[GeofenceService] Could not get plugin state:', e);
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
    console.log('[GeofenceService] 🛣️ Route changed:', {
      routeId: route?.nid,
      routeTitle: route?.title,
      hasRoute: !!route,
      notificationsEnabled: this.routeNotificationsEnabled,
    });

    if (!this.routeNotificationsEnabled) {
      return;
    }

    if (!route) {
      console.log('[GeofenceService] 🚫 User navigated away from route - clearing geofences');
      this.activeRouteId = undefined;
      await this.clearAllGeofences();
      return;
    }

    this.activeRouteId = route.nid;

    // If stops already loaded, create fences immediately
    if (route.stops?.length) {
      console.log('[GeofenceService] 📍 Route already has stops - creating geofences immediately');
      await this.setGeofencesForRoute(route);
      return;
    }
  }

  private async handleStopsPossiblyLoaded(route: UtmRoute | undefined): Promise<void> {
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
        { routeId: route.nid },
      );
      return;
    }

    await this.setGeofencesForRoute(route);
  }

  private async clearAllGeofences(): Promise<void> {
    console.log('[GeofenceService] 🧹 Clearing all geofences');

    // Do not initialize the plugin just to clear fences
    if (!this.initialized || !this.bgGeo) {
      console.log('[GeofenceService] Plugin not initialized - just clearing state');
      this.updateState({ activeGeofences: [] });
      return;
    }

    try {
      await this.bgGeo.removeGeofences();
      this.updateState({ activeGeofences: [] });
      console.log('[GeofenceService] ✅ All geofences cleared successfully');
    } catch (e) {
      console.error('[GeofenceService] clearAllGeofences failed', e);
      this.updateState({ activeGeofences: [] });
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
        stop.location_id,
      );

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        console.warn('[GeofenceService] stop has no coords; skipping geofence', {
          identifier,
          idx,
          locationId: stop.location_id,
          location: stop.location,
        });
        continue;
      }

      // ⚠️ The minimum reliable radius is 200 meters. Anything less will likely not cause a geofence to trigger. This is documented by Apple here:
      // https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/LocationAwarenessPG/RegionMonitoring/RegionMonitoring.html
      const radius = 200;

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
      console.log(
        '[GeofenceService] 🚀 Adding geofences:',
        geofences.map(g => ({
          identifier: g.identifier,
          radius: g.radius,
          lat: g.latitude,
          lng: g.longitude,
        })),
      );

      await this.bgGeo.addGeofences(geofences);
      console.log('[GeofenceService] ✅ Geofences added successfully');
      void this.refreshActiveGeofences();
    } catch (e) {
      console.error('[GeofenceService] addGeofences failed', e);
      void this.refreshActiveGeofences();
    }
  }

  private async disableGeofencing(): Promise<void> {
    if (!this.initialized || !this.bgGeo) {
      this.updateState({ activeGeofences: [] });
      return;
    }

    try {
      await this.bgGeo.removeGeofences();
    } catch (e) {
      console.warn('[GeofenceService] disableGeofencing removeGeofences failed', e);
    }

    await this.refreshActiveGeofences();

    try {
      await this.bgGeo.stop();
    } catch (e) {
      console.warn('[GeofenceService] disableGeofencing stop failed', e);
    }
  }
}
