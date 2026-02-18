import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, interval } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import type { AuthorizationStatus, ProviderChangeEvent } from 'cordova-background-geolocation-lt';

import { CordovaService } from 'src/app/services/cordova.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { PushNotificationPermissionsService } from 'src/app/services/push-notifications/push-notification-permissions.service';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  imports: [CommonModule, TranslateModule],
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
          missing.push(this.translate.instant('appNotReady'));
        }
        if (!backgroundGeolocationAvailable) {
          missing.push(this.translate.instant('geofencingNotAvailable'));
        }
        if (!backgroundLocationOk) {
          missing.push(this.translate.instant('backgroundLocationAccess'));
        }
        if (!notificationPermissionOk) {
          missing.push(this.translate.instant('notifications'));
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
    private translate: TranslateService,
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
    return v ? this.translate.instant('permissionGranted') : this.translate.instant('noPermission');
  }

  protected backgroundLocationStatusText(status: AuthorizationStatus | 'unavailable'): string {
    if (status === 'unavailable') {
      return this.translate.instant('notAvailable');
    }

    const bg = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
    if (!bg) {
      return this.translate.instant('unknown');
    }

    switch (status) {
      case bg.AUTHORIZATION_STATUS_ALWAYS:
        return this.translate.instant('permissionAlways');
      case bg.AUTHORIZATION_STATUS_WHEN_IN_USE:
        return this.translate.instant('permissionWhenInUse');
      case bg.AUTHORIZATION_STATUS_DENIED:
        return this.translate.instant('permissionDenied');
      case bg.AUTHORIZATION_STATUS_NOT_DETERMINED:
        return this.translate.instant('permissionNotDetermined');
      default:
        return this.translate.instant('unknown');
    }
  }
}
