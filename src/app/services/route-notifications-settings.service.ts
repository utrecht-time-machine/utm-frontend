import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CordovaService } from './cordova.service';
import { GeofenceService } from './geofence/geofence.service';

@Injectable({
  providedIn: 'root',
})
export class RouteNotificationsSettingsService {
  private geofence: GeofenceService | undefined;
  private enabledSub: Subscription | undefined;

  private readonly deviceAllowsGeofencingSubject = new BehaviorSubject<boolean>(false);
  public readonly deviceAllowsGeofencing$ = this.deviceAllowsGeofencingSubject.asObservable();

  private readonly enabledSubject = new BehaviorSubject<boolean>(false);
  public readonly enabled$ = this.enabledSubject.asObservable();

  constructor(private injector: Injector, private cordova: CordovaService) {
    void this.checkDeviceAllowsGeofencing();
    this.ensureGeofenceIsWired();
  }

  private ensureGeofenceIsWired(): void {
    if (!this.geofence) {
      this.geofence = this.injector.get(GeofenceService);
    }

    if (!this.enabledSub) {
      this.enabledSub = this.geofence.state$.subscribe(state => {
        this.enabledSubject.next(state.enabled);
      });
    }
  }

  private async checkDeviceAllowsGeofencing(): Promise<void> {
    const allows: boolean = this.cordova.isAvailable();
    this.deviceAllowsGeofencingSubject.next(allows);
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
}
