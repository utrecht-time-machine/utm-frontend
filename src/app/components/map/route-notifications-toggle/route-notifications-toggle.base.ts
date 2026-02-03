import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';

export abstract class RouteNotificationsToggleBase {
  constructor(
    protected routeNotifications: RouteNotificationsSettingsService
  ) {}

  public get enabled(): boolean {
    return this.routeNotifications.getEnabled();
  }

  public async onToggleChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement | null;
    const requested = Boolean(target?.checked);

    await this.routeNotifications.setEnabled(requested);

    if (target) {
      target.checked = this.enabled;
    }
  }
}
