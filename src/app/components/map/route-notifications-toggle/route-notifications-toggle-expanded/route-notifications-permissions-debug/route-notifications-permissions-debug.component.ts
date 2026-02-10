import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, interval } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import type { AuthorizationStatus, ProviderChangeEvent } from 'cordova-background-geolocation-lt';

import { CordovaService } from 'src/app/services/cordova.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { PushNotificationPermissionsService } from 'src/app/services/push-notifications/push-notification-permissions.service';

type BgGeo = typeof import('cordova-background-geolocation-lt').default;

type PermissionStatus = {
  cordovaReady: boolean;
  backgroundGeolocationAvailable: boolean;
  locationPermissionOk: boolean;
  notificationPermissionOk: boolean;
  geofenceEnabled: boolean;
  providerStatus: AuthorizationStatus | undefined;
  providerStatusLabel: string;
};

@Component({
    selector: 'app-route-notifications-permissions-debug',
    imports: [CommonModule],
    templateUrl: './route-notifications-permissions-debug.component.html',
    styleUrls: ['./route-notifications-permissions-debug.component.scss']
})
export class RouteNotificationsPermissionsDebugComponent
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  private cordovaReady$ = new BehaviorSubject<boolean>(false);
  private backgroundGeolocationAvailable$ = new BehaviorSubject<boolean>(false);
  private locationPermissionOk$ = new BehaviorSubject<boolean>(false);
  private notificationPermissionOk$ = new BehaviorSubject<boolean>(false);
  private geofenceEnabled$ = new BehaviorSubject<boolean>(false);
  private providerStatus$ = new BehaviorSubject<AuthorizationStatus | undefined>(
    undefined
  );

  readonly status$ = combineLatest([
    this.cordovaReady$,
    this.backgroundGeolocationAvailable$,
    this.locationPermissionOk$,
    this.notificationPermissionOk$,
    this.geofenceEnabled$,
    this.providerStatus$,
  ]).pipe(
    map(
      ([
        cordovaReady,
        backgroundGeolocationAvailable,
        locationPermissionOk,
        notificationPermissionOk,
        geofenceEnabled,
        providerStatus,
      ]): PermissionStatus => {
        return {
          cordovaReady,
          backgroundGeolocationAvailable,
          locationPermissionOk,
          notificationPermissionOk,
          geofenceEnabled,
          providerStatus,
          providerStatusLabel: this.authorizationStatusToLabel(providerStatus),
        };
      }
    )
  );

  constructor(
    private cordova: CordovaService,
    private geofenceService: GeofenceService,
    private pushNotificationPermissions: PushNotificationPermissionsService
  ) {}

  async ngOnInit(): Promise<void> {
    const ready = await this.cordova.ready();
    this.cordovaReady$.next(ready);

    const bg = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
    this.backgroundGeolocationAvailable$.next(Boolean(bg));

    this.geofenceService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.geofenceEnabled$.next(state.enabled);
        this.locationPermissionOk$.next(state.locationPermissionOk);
      });

    interval(1500)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$),
        switchMap(async () => {
          const ok = await this.pushNotificationPermissions.hasPermission();
          return ok;
        })
      )
      .subscribe((ok) => this.notificationPermissionOk$.next(ok));

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
            const providerState: ProviderChangeEvent =
              await plugin.getProviderState();
            return providerState?.status as AuthorizationStatus | undefined;
          } catch {
            return undefined;
          }
        })
      )
      .subscribe((status) => this.providerStatus$.next(status));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected ok(v: boolean): string {
    return v ? 'OK' : 'NOT OK';
  }

  private authorizationStatusToLabel(
    status: AuthorizationStatus | undefined
  ): string {
    if (status === undefined || status === null) {
      return 'unknown';
    }

    const plugin = (window as any)?.BackgroundGeolocation as BgGeo | undefined;
    if (!plugin) {
      return String(status);
    }

    if (status === plugin.AUTHORIZATION_STATUS_DENIED) {
      return 'DENIED';
    }

    if (status === plugin.AUTHORIZATION_STATUS_NOT_DETERMINED) {
      return 'NOT_DETERMINED';
    }

    if (status === plugin.AUTHORIZATION_STATUS_WHEN_IN_USE) {
      return 'WHEN_IN_USE';
    }

    if (status === plugin.AUTHORIZATION_STATUS_ALWAYS) {
      return 'ALWAYS';
    }

    return String(status);
  }
}
