import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';
import { ToastService } from '../../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { PushNotificationService } from '../../../services/push-notifications/push-notification.service';

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
    protected pushNotification: PushNotificationService,
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
        if (!wasEnabled) {
          if (success) {
            void this.pushNotification.scheduleLocalNotification({
              id: Date.now(),
              title: this.translate.instant('pushNotifications'),
              text: this.translate.instant('routeNotificationsEnabled'),
              trigger: { at: new Date(Date.now() + 1000) },
            });
          } else {
            this.toast.show(this.translate.instant('routeNotificationsPermissionRequired'));
            this.shaking = true;
            setTimeout(() => (this.shaking = false), 500);
          }
        }
      })
      .finally(() => (this.busy = false));
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
