import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, interval } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import type { AuthorizationStatus, ProviderChangeEvent } from 'cordova-background-geolocation-lt';

import { CordovaService } from 'src/app/services/cordova.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { PushNotificationPermissionsService } from 'src/app/services/push-notifications/push-notification-permissions.service';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

type PermissionStatus = {
  cordovaReady: boolean;
  backgroundGeolocationAvailable: boolean;
  notificationPermissionOk: boolean;
  geofenceEnabled: boolean;
  backgroundLocationOk: boolean;
  backgroundLocationStatus: AuthorizationStatus | 'unavailable';
  missing: string[];
};

@Component({
  selector: 'app-route-notifications-permissions',
  imports: [CommonModule],
  templateUrl: './route-notifications-permissions.component.html',
  styleUrls: ['./route-notifications-permissions.component.scss'],
})
export class RouteNotificationsPermissionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private cordovaReady$ = new BehaviorSubject<boolean>(false);
  private backgroundGeolocationAvailable$ = new BehaviorSubject<boolean>(false);
  private notificationPermissionOk$ = new BehaviorSubject<boolean>(false);
  private geofenceEnabled$ = new BehaviorSubject<boolean>(false);
  private providerStatus$ = new BehaviorSubject<AuthorizationStatus | undefined>(undefined);

  readonly status$ = combineLatest([
    this.cordovaReady$,
    this.backgroundGeolocationAvailable$,
    this.notificationPermissionOk$,
    this.geofenceEnabled$,
    this.providerStatus$,
  ]).pipe(
    map(
      ([
        cordovaReady,
        backgroundGeolocationAvailable,
        notificationPermissionOk,
        geofenceEnabled,
        providerStatus,
      ]): PermissionStatus => {
        const bg = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
        const backgroundLocationOk =
          Boolean(bg) && providerStatus === bg?.AUTHORIZATION_STATUS_ALWAYS;

        const backgroundLocationStatus: AuthorizationStatus | 'unavailable' =
          !bg || !providerStatus ? 'unavailable' : providerStatus;

        const missing: string[] = [];
        if (!cordovaReady) {
          missing.push('App is nog niet klaar');
        }
        if (!backgroundGeolocationAvailable) {
          missing.push('Geofencing niet beschikbaar op dit apparaat');
        }
        if (!backgroundLocationOk) {
          missing.push('Locatie-toegang in de achtergrond');
        }
        if (!notificationPermissionOk) {
          missing.push('Notificaties');
        }

        return {
          cordovaReady,
          backgroundGeolocationAvailable,
          notificationPermissionOk,
          geofenceEnabled,
          backgroundLocationOk,
          backgroundLocationStatus,
          missing,
        };
      },
    ),
  );

  constructor(
    private cordova: CordovaService,
    private geofenceService: GeofenceService,
    private pushNotificationPermissions: PushNotificationPermissionsService,
    private routeNotifications: RouteNotificationsSettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const ready = await this.cordova.ready();
    this.cordovaReady$.next(ready);

    const bg = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
    this.backgroundGeolocationAvailable$.next(Boolean(bg));

    this.geofenceService.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.geofenceEnabled$.next(state.enabled);
    });

    interval(1500)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(async () => {
          const ok = await this.pushNotificationPermissions.hasPermission();
          return ok;
        }),
      )
      .subscribe(ok => this.notificationPermissionOk$.next(ok));

    interval(1500)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(async () => {
          const plugin = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
          if (!plugin) {
            return undefined;
          }

          try {
            const providerState: ProviderChangeEvent = await plugin.getProviderState();
            return providerState?.status as AuthorizationStatus | undefined;
          } catch {
            return undefined;
          }
        }),
      )
      .subscribe(status => this.providerStatus$.next(status));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected ok(v: boolean): string {
    return v ? 'Toestemming gegeven' : 'Geen toestemming';
  }

  protected backgroundLocationStatusText(status: AuthorizationStatus | 'unavailable'): string {
    if (status === 'unavailable') {
      return 'Niet beschikbaar';
    }

    const bg = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
    if (!bg) {
      return 'Onbekend';
    }

    switch (status) {
      case bg.AUTHORIZATION_STATUS_ALWAYS:
        return 'Toestemming gegeven';
      case bg.AUTHORIZATION_STATUS_WHEN_IN_USE:
        return 'Alleen tijdens gebruik';
      case bg.AUTHORIZATION_STATUS_DENIED:
        return 'Geweigerd';
      case bg.AUTHORIZATION_STATUS_NOT_DETERMINED:
        return 'Nog gevraagd';
      default:
        return 'Onbekend';
    }
  }
}
