import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';

export abstract class RouteNotificationsToggleBase {
  constructor(protected routeNotifications: RouteNotificationsSettingsService) {}

  public get enabled(): boolean {
    return this.routeNotifications.getEnabled();
  }

  public set enabled(value: boolean) {
    this.routeNotifications.setEnabled(value);
  }
}
