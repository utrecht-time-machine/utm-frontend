import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';
import { Observable } from 'rxjs';

export abstract class RouteNotificationsToggleBase {
  public readonly enabled$: Observable<boolean>;

  constructor(protected routeNotifications: RouteNotificationsSettingsService) {
    this.enabled$ = this.routeNotifications.enabled$;
  }

  public async onToggleChange(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement | null;
    const requested = Boolean(target?.checked);

    await this.routeNotifications.setEnabled(requested);
  }
}
