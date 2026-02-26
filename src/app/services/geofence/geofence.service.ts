import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CordovaService } from '../cordova.service';
import { DebugLogService } from '../debug-log.service';
import { PushNotificationPermissionsService } from '../push-notifications/push-notification-permissions.service';
import { GeofenceNotificationService } from './geofence-notification.service';
import { GeofencePermissionsService } from './geofence-permissions.service';
import { UtmRoutesService } from '../utm-routes.service';
import { UtmRoute } from '../../models/utm-route';
import { UtmRouteStop } from '../../models/utm-route-stop';
import { PROXIMITY_RADIUS_METERS, ALLOW_REPEAT_NOTIFICATIONS } from './geofence.constants';

import type {
  Config,
  HeartbeatEvent,
  Location,
  ProviderChangeEvent,
} from 'cordova-background-geolocation-lt';
import { RouteStopData } from 'src/app/models/route-stop-data';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

export type GeofenceState = {
  enabled: boolean;
  locationPermissionOk: boolean;
  trackedStops: TrackedStop[];
};

interface TrackedStop {
  lat: number;
  lng: number;
  routeId: string;
  routeTitle: string;
  stopIdx: number;
  stopTitle: string;
  locationId: string | number | undefined;
  notified: boolean;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

  private trackedStops: TrackedStop[] = [];

  private readonly stateSubject = new BehaviorSubject<GeofenceState>({
    enabled: false,
    locationPermissionOk: false,
    trackedStops: [],
  });

  public readonly state$ = this.stateSubject.asObservable();

  private activeRouteId: string | undefined;

  constructor(
    private cordova: CordovaService,
    private utmRoutes: UtmRoutesService,
    private geofenceNotifications: GeofenceNotificationService,
    private geofencePermissions: GeofencePermissionsService,
    private pushNotificationPermissions: PushNotificationPermissionsService,
    private zone: NgZone,
    private logger: DebugLogService,
  ) {
    void this.ensureInitialized();
  }

  private async startTrackingEngine(): Promise<void> {
    if (!this.bgGeo) {
      return;
    }

    try {
      await this.bgGeo.start();
    } catch (e) {
      this.logger.warn('GeofenceService', 'startTrackingEngine failed', e);
    }
  }

  private async stopTrackingEngine(): Promise<void> {
    if (!this.bgGeo) {
      return;
    }

    try {
      await this.bgGeo.stop();
      this.logger.log('GeofenceService', 'Tracking engine stopped');
    } catch (e) {
      this.logger.warn('GeofenceService', 'stopTrackingEngine failed', e);
    }
  }

  private checkProximity(lat: number, lng: number): void {
    if (this.trackedStops.length === 0) {
      this.logger.log('GeofenceService', 'checkProximity: No stops currently tracked');
      return;
    }

    this.logger.log(
      'GeofenceService',
      `checkProximity: Checking ${this.trackedStops.length} stops`,
      {
        lat,
        lng,
        radius: PROXIMITY_RADIUS_METERS,
        allowRepeat: ALLOW_REPEAT_NOTIFICATIONS,
      },
    );

    for (const stop of this.trackedStops) {
      const distance = haversineDistance(lat, lng, stop.lat, stop.lng);

      if (!ALLOW_REPEAT_NOTIFICATIONS && stop.notified) {
        this.logger.log(
          'GeofenceService',
          `checkProximity: Stop ${stop.stopIdx} ("${
            stop.stopTitle
          }") already notified, skipping. Distance: ${Math.round(distance)}m`,
        );
        continue;
      }

      if (distance <= PROXIMITY_RADIUS_METERS) {
        stop.notified = true;
        this.logger.log('GeofenceService', 'Proximity trigger MATCH', {
          stopIdx: stop.stopIdx,
          stopTitle: stop.stopTitle,
          distance: Math.round(distance),
          threshold: PROXIMITY_RADIUS_METERS,
          allowRepeat: ALLOW_REPEAT_NOTIFICATIONS,
        });

        const meta: RouteStopData = {
          routeId: stop.routeId,
          routeTitle: stop.routeTitle,
          stopIdx: stop.stopIdx,
          stopTitle: stop.stopTitle,
        };

        void this.geofenceNotifications.handleProximityTrigger(meta).catch(e => {
          this.logger.warn('GeofenceService', 'proximity notification handler failed', e);
        });

        this.updateState({ trackedStops: [...this.trackedStops] });
      } else {
        this.logger.log(
          'GeofenceService',
          `checkProximity: Stop ${stop.stopIdx} ("${stop.stopTitle}") out of range`,
          {
            distance: Math.round(distance),
            threshold: PROXIMITY_RADIUS_METERS,
            lat: stop.lat,
            lng: stop.lng,
          },
        );
      }
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

  public async setRouteNotificationsEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      if (this.routeNotificationsEnabled) {
        return this.stateSubject.getValue().enabled;
      }

      this.logger.log('GeofenceService', 'enabling route notifications geofencing');
      const ok = await this.ensureInitialized();
      if (!ok) {
        this.logger.warn(
          'GeofenceService',
          'enabling route notifications failed: plugin not initialized',
        );
        this.updateState({ enabled: false, trackedStops: [] });
        return false;
      }

      try {
        await this.bgGeo!.requestPermission();
      } catch {
        // requestPermission rejects when the user denies — handled below.
      }

      const hasLocationPermission = await this.checkHasLocationPermission();
      if (!hasLocationPermission) {
        this.logger.warn(
          'GeofenceService',
          'enabling route notifications failed: permissions not authorized',
        );
        this.updateState({ enabled: false, trackedStops: [] });
        await this.disableTracking();
        return false;
      }

      const hasNotificationPermission = await this.pushNotificationPermissions.ensurePermission();
      if (!hasNotificationPermission) {
        this.logger.warn(
          'GeofenceService',
          'enabling route notifications failed: notification permissions not authorized',
        );
        this.updateState({ enabled: false, trackedStops: [] });
        await this.disableTracking();
        return false;
      }

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

    this.logger.log('GeofenceService', 'disabling route notifications');
    this.teardownSubscriptions();
    await this.disableTracking();

    this.updateState({ enabled: false, trackedStops: [] });

    return true;
  }

  public async checkHasLocationPermission(): Promise<boolean> {
    if (!this.bgGeo) {
      return false;
    }

    const ok = await this.geofencePermissions.hasLocationPermission(this.bgGeo);
    this.updateState({ locationPermissionOk: ok });

    if (!ok && this.routeNotificationsEnabled) {
      this.logger.warn(
        'GeofenceService',
        'location permission not granted; disabling route notifications',
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
      this.logger.warn(
        'GeofenceService',
        'BackgroundGeolocation plugin not found on window. Is cordova-background-geolocation-lt installed and built?',
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
        this.logger.warn('GeofenceService', 'ensureInitialized: no plugin available');
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

          plugin.onLocation(
            (location: Location) => {
              this.logger.log('GeofenceService', 'onLocation update received', {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                accuracy: location.coords.accuracy,
                timestamp: new Date().toISOString(),
                velocity: location.coords.speed,
                isMoving: location.is_moving,
                trackedStopsCount: this.trackedStops.length,
                notificationsEnabled: this.routeNotificationsEnabled,
              });

              if (this.routeNotificationsEnabled) {
                if (this.trackedStops.length > 0) {
                  this.checkProximity(location.coords.latitude, location.coords.longitude);
                } else {
                  this.logger.log(
                    'GeofenceService',
                    'onLocation: Skipping proximity check (no stops tracked)',
                  );
                }
              } else {
                this.logger.log(
                  'GeofenceService',
                  'onLocation: Skipping proximity check (notifications disabled)',
                );
              }
            },
            error => {
              this.logger.warn('GeofenceService', 'onLocation error', error);
            },
          );

          plugin.onMotionChange(location => {
            this.logger.log('GeofenceService', 'Motion change', {
              isMoving: location.isMoving,
              lat: location.location.coords.latitude,
              lng: location.location.coords.longitude,
              timestamp: new Date().toISOString(),
            });
          });

          plugin.onHeartbeat(async (event: HeartbeatEvent) => {
            if (!this.routeNotificationsEnabled || this.trackedStops.length === 0) {
              return;
            }

            this.logger.log('GeofenceService', 'Heartbeat — requesting current position');
            try {
              const location = await plugin.getCurrentPosition({
                samples: 1,
                persist: false,
                desiredAccuracy: 10,
                timeout: 15,
              });
              this.checkProximity(location.coords.latitude, location.coords.longitude);
            } catch (e) {
              this.logger.warn('GeofenceService', 'Heartbeat getCurrentPosition failed', e);
            }
          });

          plugin.onEnabledChange((isEnabled: boolean) => {
            this.logger.log('GeofenceService', 'onEnabledChange', isEnabled);
            if (!isEnabled && this.routeNotificationsEnabled) {
              this.logger.warn('GeofenceService', 'Plugin disabled externally; syncing state');
              this.routeNotificationsEnabled = false;
              this.teardownSubscriptions();
            }
            this.updateState({ enabled: isEnabled });
          });
        }

        const config: Config = {
          debug: true,
          logLevel: plugin.LOG_LEVEL_VERBOSE,
          desiredAccuracy: plugin.DESIRED_ACCURACY_HIGH,
          distanceFilter: 30, // The minimum distance (meters) a device must move horizontally before an update event is generated. By default, distanceFilter is elastically auto-calculated: When speed increases, distanceFilter increases; when speed decreases, so too does distanceFilter.
          // locationUpdateInterval: 5000, // Android only, requires distanceFilter to be 0
          // fastestLocationUpdateInterval: 3000, // Android only
          stopTimeout: 5,
          preventSuspend: true,
          heartbeatInterval: 60, // Minimum 60 on Android
          stopOnTerminate: true,
          startOnBoot: false,
          enableHeadless: false,
          locationAuthorizationRequest: 'Always',
          backgroundPermissionRationale: {
            title: 'Locatie in de achtergrond',
            message:
              "Utrecht Time Machine gebruikt je locatie om meldingen te sturen als je een routepunt nadert. Om dit te laten werken, moet je 'Altijd' locatie‑toegang inschakelen in de instellingen.",
            positiveAction: 'Ok',
            negativeAction: 'Niet nu',
          },
          notification: {
            title: 'Utrecht Time Machine',
            text: 'Routemeldingen actief',
            sticky: true,
            channelName: 'Routemeldingen',
          },
        };

        const readyState = await plugin.ready(config);
        this.logger.log('GeofenceService', 'Plugin ready state', readyState);

        this.initialized = true;

        // The plugin persists its enabled state across app launches via ready().
        // Sync our internal state to match the actual plugin state so the UI
        // always accurately reflects whether tracking is running.
        if (readyState.enabled) {
          this.logger.log(
            'GeofenceService',
            'Plugin was already running from a previous session — verifying permissions before syncing state',
          );
          const hasLocationPermission = await this.geofencePermissions.hasLocationPermission(
            plugin,
          );
          this.updateState({ locationPermissionOk: hasLocationPermission });

          if (!hasLocationPermission) {
            this.logger.warn(
              'GeofenceService',
              'Persisted session found but location permission no longer granted — disabling',
            );
            await this.disableTracking();
            this.updateState({ enabled: false, trackedStops: [] });
          } else {
            this.routeNotificationsEnabled = true;
            this.initSubscriptions();
            this.updateState({ enabled: true });
          }
        }

        return true;
      } catch (e) {
        this.logger.error('GeofenceService', 'ensureInitialized failed', e);
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
    this.logger.log('GeofenceService', 'Route changed', {
      routeId: route?.nid,
      routeTitle: route?.title,
      hasRoute: !!route,
      notificationsEnabled: this.routeNotificationsEnabled,
    });

    if (!this.routeNotificationsEnabled) {
      return;
    }

    if (!route) {
      this.logger.log(
        'GeofenceService',
        'User navigated away from route - stopping tracking engine',
      );
      this.activeRouteId = undefined;
      this.clearTrackedStops();
      await this.stopTrackingEngine();
      return;
    }

    this.activeRouteId = route.nid;

    // Ensure the engine is running when a route is selected and the user has enabled notifications
    await this.startTrackingEngine();

    // If stops already loaded, set up tracking immediately
    if (route.stops?.length) {
      this.logger.log(
        'GeofenceService',
        'Route already has stops - setting up tracking immediately',
      );
      this.setStopsForRoute(route);
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
      this.logger.warn(
        'GeofenceService',
        'handleStopsPossiblyLoaded: event fired but route has no stops',
        { routeId: route.nid },
      );
      return;
    }

    this.setStopsForRoute(route);
  }

  private clearTrackedStops(): void {
    this.logger.log('GeofenceService', 'Clearing tracked stops');
    this.trackedStops = [];
    this.updateState({ trackedStops: [] });
  }

  private setStopsForRoute(route: UtmRoute): void {
    if (!this.routeNotificationsEnabled) {
      return;
    }

    this.clearTrackedStops();

    const stops = route.stops ?? [];
    const tracked: TrackedStop[] = [];

    for (let idx = 0; idx < stops.length; idx++) {
      const stop: UtmRouteStop = stops[idx];
      const coords = stop.location?.coords;
      const lat = coords?.lat;
      const lng = coords?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        this.logger.warn('GeofenceService', 'stop has no coords; skipping', {
          idx,
          locationId: stop.location_id,
          location: stop.location,
        });
        continue;
      }

      tracked.push({
        lat,
        lng,
        routeId: route.nid,
        routeTitle: route.title,
        stopIdx: idx,
        stopTitle: stop.title,
        locationId: stop.location_id,
        notified: false,
      });
    }

    if (!tracked.length) {
      this.logger.warn('GeofenceService', 'No valid stops to track', {
        routeId: route.nid,
        totalStops: stops.length,
      });
      return;
    }

    this.trackedStops = tracked;
    this.updateState({ trackedStops: [...tracked] });

    this.logger.log(
      'GeofenceService',
      'Tracking stops set',
      tracked.map(s => ({
        stopIdx: s.stopIdx,
        stopTitle: s.stopTitle,
        lat: s.lat,
        lng: s.lng,
      })),
    );

    // Immediately check proximity with current position if available
    if (this.bgGeo) {
      void this.bgGeo
        .getCurrentPosition({ samples: 1, persist: false, desiredAccuracy: 10, timeout: 10 })
        .then(location => {
          this.checkProximity(location.coords.latitude, location.coords.longitude);
        })
        .catch(() => {
          // Ignore — first onLocation will handle it
        });
    }
  }

  private async disableTracking(): Promise<void> {
    this.clearTrackedStops();
    await this.stopTrackingEngine();
  }
}
