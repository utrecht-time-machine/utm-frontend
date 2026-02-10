import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { UtmRoute } from '../../../models/utm-route';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';

@Component({
    selector: 'app-route-steps',
    templateUrl: './route-steps.component.html',
    styleUrls: ['./route-steps.component.scss'],
    standalone: false
})
export class RouteStepsComponent {
  constructor(
    public utmRoutes: UtmRoutesService,
    public routeNotifications: RouteNotificationsSettingsService
  ) {}

  public get selectedRoute(): UtmRoute | undefined {
    return this.utmRoutes.selected.getValue();
  }

  public get routeDurationStr(): string {
    return this.selectedRoute?.duration_minutes
      ? `(${this.selectedRoute.duration_minutes} min)`
      : '';
  }

  public get routeDistanceStr(): string {
    return this.selectedRoute?.distance ? `${this.selectedRoute.distance}` : '';
  }

  public get routeTypeStr(): string {
    if (this.selectedRoute?.type == 'Fietsroute') {
      return 'cycling';
    }
    return 'walking';
  }
}
