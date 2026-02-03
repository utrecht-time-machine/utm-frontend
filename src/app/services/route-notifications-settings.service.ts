import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CordovaService } from './cordova.service';
import { GeofenceService } from './geofence.service';

@Injectable({
  providedIn: 'root',
})
export class RouteNotificationsSettingsService {
  private readonly enabledStorageKey = 'utm.routeNotificationsEnabled';

  private geofence: GeofenceService | undefined;

  private readonly geofencingAvailableSubject = new BehaviorSubject<boolean>(
    false
  );
  public readonly geofencingAvailable$ =
    this.geofencingAvailableSubject.asObservable();

  private readonly enabledSubject = new BehaviorSubject<boolean>(
    this.loadEnabled()
  );

  public readonly enabled$ = this.enabledSubject.asObservable();

  constructor(private injector: Injector, private cordova: CordovaService) {
    void this.detectGeofencingAvailability();

    if (this.enabledSubject.getValue()) {
      this.geofence = this.injector.get(GeofenceService);
      void this.geofence.setRouteNotificationsEnabled(true);
    }
  }

  private async detectGeofencingAvailability(): Promise<void> {
    try {
      const ready = await this.cordova.ready(2000);
      const plugin = (window as any)?.BackgroundGeolocation;
      this.geofencingAvailableSubject.next(Boolean(ready && plugin));
    } catch {
      this.geofencingAvailableSubject.next(false);
    }
  }

  public getEnabled(): boolean {
    return this.enabledSubject.getValue();
  }

  public setEnabled(enabled: boolean): void {
    this.enabledSubject.next(enabled);
    this.saveEnabled(enabled);

    if (enabled) {
      this.geofence = this.injector.get(GeofenceService);
      void this.geofence.setRouteNotificationsEnabled(true);
      return;
    }

    if (!this.geofence) {
      return;
    }

    void this.geofence.setRouteNotificationsEnabled(false);
  }

  private loadEnabled(): boolean {
    try {
      const v = (window as any)?.localStorage?.getItem(this.enabledStorageKey);
      if (v === null) return false;
      return v === 'true';
    } catch {
      return false;
    }
  }

  private saveEnabled(enabled: boolean): void {
    try {
      (window as any)?.localStorage?.setItem(
        this.enabledStorageKey,
        String(enabled)
      );
    } catch {
      // ignore
    }
  }
}
