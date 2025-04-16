import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { UtmTranslateService } from '../../services/utm-translate.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';
import { UtmRoute } from 'src/app/models/utm-route';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent {
  constructor(
    public router: Router,
    public utmRoutes: UtmRoutesService,
    public utmTranslate: UtmTranslateService,
    private themes: ThemeService,
    private time: TimeService
  ) {}

  isRouteVisible(route: UtmRoute): boolean {
    const passesThemeFilter = this.themes.shouldShow(route.theme_ids || []);

    const passesTimeFilter = this.time.isInSelectedRange(
      [route.min_date_str || ''],
      [route.max_date_str || '']
    );

    return passesThemeFilter && passesTimeFilter;
  }

  async selectRoute(url: string, nid: string) {
    await this.utmRoutes.selectByUrlOrId(url, nid);
  }
}
