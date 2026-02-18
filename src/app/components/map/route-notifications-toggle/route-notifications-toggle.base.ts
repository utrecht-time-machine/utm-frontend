import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';

@Directive()
export abstract class RouteNotificationsToggleBase implements OnDestroy {
  public enabled = false;
  private _sub: Subscription;

  constructor(protected routeNotifications: RouteNotificationsSettingsService) {
    this._sub = this.routeNotifications.enabled$.subscribe(v => (this.enabled = v));
  }

  public onToggleClick(): void {
    void this.routeNotifications.setEnabled(!this.enabled);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
