import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from '../route-notifications-toggle.base';

@Component({
  selector: 'app-route-notifications-toggle-compact',
  standalone: true,
  templateUrl: './route-notifications-toggle-compact.component.html',
  styleUrls: ['./route-notifications-toggle-compact.component.scss'],
})
export class RouteNotificationsToggleCompactComponent extends RouteNotificationsToggleBase {
  constructor(routeNotifications: RouteNotificationsSettingsService) {
    super(routeNotifications);
  }
}
