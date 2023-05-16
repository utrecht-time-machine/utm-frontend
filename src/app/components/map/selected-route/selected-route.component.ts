import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { SelectedView } from '../../../models/selected-view';
import { Router } from '@angular/router';
import { RoutingService } from '../../../services/routing.service';

@Component({
  selector: 'app-selected-route',
  templateUrl: './selected-route.component.html',
  styleUrls: ['./selected-route.component.scss'],
})
export class SelectedRouteComponent {
  constructor(
    public utmRoutes: UtmRoutesService,
    private routing: RoutingService,
    private router: Router
  ) {}

  public get selectedRoute() {
    return this.utmRoutes.selected.getValue();
  }

  ngOnInit() {
    const navigatedToUtmRoutePage =
      this.routing.getSelectedView() == SelectedView.Routes;

    if (navigatedToUtmRoutePage) {
      void this.utmRoutes.selectByUrlOrId(this.router.url);
    }
  }
}
