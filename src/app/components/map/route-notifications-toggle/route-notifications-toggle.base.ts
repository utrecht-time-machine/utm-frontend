import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';
import { ToastService } from '../../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export abstract class RouteNotificationsToggleBase implements OnDestroy {
  public enabled = false;
  public busy = false;
  public shaking = false;
  private _sub: Subscription;

  constructor(
    protected routeNotifications: RouteNotificationsSettingsService,
    protected toast: ToastService,
    protected translate: TranslateService,
  ) {
    this._sub = this.routeNotifications.enabled$.subscribe(v => (this.enabled = v));
  }

  public onToggleClick(): void {
    if (this.busy) return;

    const wasEnabled = this.enabled;
    this.busy = true;
    void this.routeNotifications
      .setEnabled(!this.enabled)
      .then(success => {
        // Only show toast/shake when trying to enable and it fails
        if (!wasEnabled && !success) {
          this.toast.show(this.translate.instant('routeNotificationsPermissionRequired'));
          this.shaking = true;
          setTimeout(() => (this.shaking = false), 500);
        }
      })
      .finally(() => (this.busy = false));
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
