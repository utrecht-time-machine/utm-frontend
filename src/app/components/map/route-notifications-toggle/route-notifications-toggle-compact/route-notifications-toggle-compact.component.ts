import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from '../route-notifications-toggle.base';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { RouteToggleComponent } from '../route-toggle/route-toggle.component';
import { PushNotificationService } from 'src/app/services/push-notifications/push-notification.service';

@Component({
  selector: 'app-route-notifications-toggle-compact',
  standalone: true,
  templateUrl: './route-notifications-toggle-compact.component.html',
  styleUrls: ['./route-notifications-toggle-compact.component.scss'],
  imports: [RouteToggleComponent],
})
export class RouteNotificationsToggleCompactComponent extends RouteNotificationsToggleBase {
  constructor(
    routeNotifications: RouteNotificationsSettingsService,
    toast: ToastService,
    translate: TranslateService,
    pushNotification: PushNotificationService,
  ) {
    super(routeNotifications, toast, translate, pushNotification);
  }
}
