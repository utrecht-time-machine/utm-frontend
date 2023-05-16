import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent {
  constructor(
    public router: Router,
    public utmRoutes: UtmRoutesService,
    private map: MapService
  ) {}

  async selectRoute(url: string, nid: string) {
    this.map.showSpinner = true;
    await this.utmRoutes.selectByUrlOrId(url, nid);
    this.map.showSpinner = false;
  }
}
