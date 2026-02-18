import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from '../route-notifications-toggle.base';
import { RouteNotificationsPermissionsComponent } from './route-notifications-permissions/route-notifications-permissions.component';
import { ToastService } from 'src/app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { RouteToggleComponent } from '../route-toggle/route-toggle.component';

@Component({
  selector: 'app-route-notifications-toggle-expanded',
  imports: [RouteNotificationsPermissionsComponent, RouteToggleComponent],
  templateUrl: './route-notifications-toggle-expanded.component.html',
  styleUrls: ['./route-notifications-toggle-expanded.component.scss'],
})
export class RouteNotificationsToggleExpandedComponent extends RouteNotificationsToggleBase {
  constructor(
    routeNotifications: RouteNotificationsSettingsService,
    toast: ToastService,
    translate: TranslateService,
  ) {
    super(routeNotifications, toast, translate);
  }
}
