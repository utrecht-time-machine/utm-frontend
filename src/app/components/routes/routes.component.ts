import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { UtmTranslateService } from '../../services/utm-translate.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';
import { UtmRoute } from 'src/app/models/utm-route';
import { OrganisationFilterService } from 'src/app/services/organisation-filter.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
    selector: 'app-routes',
    templateUrl: './routes.component.html',
    styleUrls: ['./routes.component.scss'],
    standalone: false
})
export class RoutesComponent {
  sortedRoutes: UtmRoute[] = [];

  constructor(
    public router: Router,
    public utmRoutes: UtmRoutesService,
    public utmTranslate: UtmTranslateService,
    public imageService: ImageService,
    private themes: ThemeService,
    private time: TimeService,
    private organisations: OrganisationFilterService
  ) {
    this.utmRoutes.all.subscribe(() => {
      this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
    });

    this.themes.selectedIds.subscribe(() => {
      this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
    });

    this.organisations.selectedIds.subscribe(() => {
      this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
    });

    this.time.minYear.subscribe(() => {
      this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
    });

    this.time.maxYear.subscribe(() => {
      this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
    });
  }

  isRouteVisible(route: UtmRoute): boolean {
    const passesThemeFilter = this.themes.shouldShow(route.theme_ids || []);

    const passesTimeFilter = this.time.isInSelectedRange(
      [route.min_date_str || ''],
      [route.max_date_str || '']
    );

    const passesOrganisationFilter = this.organisations.shouldShow(
      route.organisation_ids || []
    );

    return passesThemeFilter && passesTimeFilter && passesOrganisationFilter;
  }

  private sortRoutesByVisibility(routes: UtmRoute[]): UtmRoute[] {
    return [...routes].sort((a, b) => {
      const aVisible = this.isRouteVisible(a);
      const bVisible = this.isRouteVisible(b);

      if (aVisible === bVisible) {
        return 0;
      }
      return aVisible ? -1 : 1;
    });
  }

  async selectRoute(url: string, nid: string) {
    await this.utmRoutes.selectByUrlOrId(url, nid);
  }
}
