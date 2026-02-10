import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CordovaService } from './cordova.service';
import { GeofenceService } from './geofence/geofence.service';

@Injectable({
  providedIn: 'root',
})
export class RouteNotificationsSettingsService {
  private readonly enabledStorageKey = 'utm.routeNotificationsEnabled';

  private geofence: GeofenceService | undefined;
  private enabledSub: Subscription | undefined;

  private readonly deviceAllowsGeofencingSubject = new BehaviorSubject<boolean>(
    false,
  );
  public readonly deviceAllowsGeofencing$ =
    this.deviceAllowsGeofencingSubject.asObservable();

  private readonly enabledSubject = new BehaviorSubject<boolean>(false);
  public readonly enabled$ = this.enabledSubject.asObservable();

  constructor(
    private injector: Injector,
    private cordova: CordovaService,
  ) {
    void this.checkDeviceAllowsGeofencing();

    if (this.loadEnabledFromLocalStorage()) {
      this.setEnabled(true);
    }
  }

  private ensureGeofenceIsWired(): void {
    if (!this.geofence) {
      this.geofence = this.injector.get(GeofenceService);
    }

    if (!this.enabledSub) {
      this.enabledSub = this.geofence.state$.subscribe((state) => {
        this.enabledSubject.next(state.enabled);
        this.saveEnabledToLocalStorage(state.enabled);
      });
    }
  }

  private async checkDeviceAllowsGeofencing(): Promise<void> {
    try {
      const ready = await this.cordova.ready(2000);
      const plugin = (window as any)?.BackgroundGeolocation;
      this.deviceAllowsGeofencingSubject.next(Boolean(ready && plugin));
    } catch {
      this.deviceAllowsGeofencingSubject.next(false);
    }
  }

  public getEnabled(): boolean {
    return this.enabledSubject.getValue();
  }

  public async setEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      this.ensureGeofenceIsWired();
      const ok = await this.geofence!.setRouteNotificationsEnabled(true);
      return ok;
    }

    this.ensureGeofenceIsWired();
    await this.geofence!.setRouteNotificationsEnabled(false);
    return false;
  }

  private loadEnabledFromLocalStorage(): boolean {
    try {
      const v = (window as any)?.localStorage?.getItem(this.enabledStorageKey);
      if (v === null) return false;
      return v === 'true';
    } catch {
      return false;
    }
  }

  private saveEnabledToLocalStorage(enabled: boolean): void {
    try {
      (window as any)?.localStorage?.setItem(
        this.enabledStorageKey,
        String(enabled),
      );
    } catch {
      // ignore
    }
  }
}
