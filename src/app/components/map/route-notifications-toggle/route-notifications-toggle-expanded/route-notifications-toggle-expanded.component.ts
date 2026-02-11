import { Component } from '@angular/core';
import { RouteNotificationsSettingsService } from 'src/app/services/route-notifications-settings.service';
import { RouteNotificationsToggleBase } from '../route-notifications-toggle.base';
import { RouteNotificationsPermissionsComponent } from './route-notifications-permissions/route-notifications-permissions.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-route-notifications-toggle-expanded',
  imports: [RouteNotificationsPermissionsComponent, AsyncPipe],
  templateUrl: './route-notifications-toggle-expanded.component.html',
  styleUrls: ['./route-notifications-toggle-expanded.component.scss'],
})
export class RouteNotificationsToggleExpandedComponent extends RouteNotificationsToggleBase {
  constructor(routeNotifications: RouteNotificationsSettingsService) {
    super(routeNotifications);
  }
}
