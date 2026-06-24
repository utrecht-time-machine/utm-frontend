import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { UtmTranslateService } from '../../services/utm-translate.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';
import { UtmRoute } from 'src/app/models/utm-route';
import { OrganisationFilterService } from 'src/app/services/organisation-filter.service';
import { ImageService } from 'src/app/services/image.service';
import { RouteSortType } from 'src/app/models/route-sort-type';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
  standalone: false,
})
export class RoutesComponent {
  sortedRoutes: UtmRoute[] = [];
  selectedSort: RouteSortType = 'relevance';

  constructor(
    public router: Router,
    public utmRoutes: UtmRoutesService,
    public utmTranslate: UtmTranslateService,
    public imageService: ImageService,
    private themes: ThemeService,
    private time: TimeService,
    private organisations: OrganisationFilterService,
    private translateService: TranslateService,
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
      [route.max_date_str || ''],
    );

    const passesOrganisationFilter = this.organisations.shouldShow(route.organisation_ids || []);

    return passesThemeFilter && passesTimeFilter && passesOrganisationFilter;
  }

  onSortChange(sortType: RouteSortType): void {
    this.selectedSort = sortType;
    this.sortedRoutes = this.sortRoutesByVisibility(this.utmRoutes.shown);
  }

  private sortRoutesByVisibility(routes: UtmRoute[]): UtmRoute[] {
    return [...routes].sort((a, b) => {
      const aVisible = this.isRouteVisible(a);
      const bVisible = this.isRouteVisible(b);

      if (aVisible !== bVisible) {
        return aVisible ? -1 : 1;
      }

      return this.applySortCriteria(a, b);
    });
  }

  private applySortCriteria(a: UtmRoute, b: UtmRoute): number {
    const currentLang = this.translateService.currentLang;
    const isDescending = this.selectedSort.endsWith('-desc');
    const direction = isDescending ? -1 : 1;

    if (this.selectedSort.startsWith('alphabetical')) {
      const titleA = currentLang === 'en' && a.title_english ? a.title_english : a.title;
      const titleB = currentLang === 'en' && b.title_english ? b.title_english : b.title;
      return titleA.localeCompare(titleB) * direction;
    }

    if (this.selectedSort.startsWith('duration')) {
      const durationA = parseInt(a.duration_minutes || '0', 10);
      const durationB = parseInt(b.duration_minutes || '0', 10);
      return (durationA - durationB) * direction;
    }

    return 0;
  }

  async selectRoute(url: string, nid: string) {
    await this.utmRoutes.selectByUrlOrId(url, nid);
  }
}
