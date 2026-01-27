import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from './route-notifications-toggle.base';

@Component({
  selector: 'app-route-notifications-toggle-expanded',
  standalone: true,
  templateUrl: './route-notifications-toggle-expanded.component.html',
  styleUrls: ['./route-notifications-toggle-expanded.component.scss'],
})
export class RouteNotificationsToggleExpandedComponent extends RouteNotificationsToggleBase {
  constructor(routeNotifications: RouteNotificationsSettingsService) {
    super(routeNotifications);
  }
}
