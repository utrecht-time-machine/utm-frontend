import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from '../route-notifications-toggle.base';
import { RouteNotificationsPermissionsDebugComponent } from './route-notifications-permissions-debug/route-notifications-permissions-debug.component';

@Component({
  selector: 'app-route-notifications-toggle-expanded',
  standalone: true,
  imports: [RouteNotificationsPermissionsDebugComponent],
  templateUrl: './route-notifications-toggle-expanded.component.html',
  styleUrls: ['./route-notifications-toggle-expanded.component.scss'],
})
export class RouteNotificationsToggleExpandedComponent extends RouteNotificationsToggleBase {
  constructor(routeNotifications: RouteNotificationsSettingsService) {
    super(routeNotifications);
  }
}
