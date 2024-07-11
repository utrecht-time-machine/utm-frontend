import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { UtmTranslateService } from '../../services/utm-translate.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent {
  constructor(
    public router: Router,
    public utmRoutes: UtmRoutesService,
    public utmTranslate: UtmTranslateService
  ) {}

  async selectRoute(url: string, nid: string) {
    await this.utmRoutes.selectByUrlOrId(url, nid);
  }
}
