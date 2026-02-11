import { Component, type OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FilterService } from 'src/app/services/filter.service';
import { OrganisationFilterService } from 'src/app/services/organisation-filter.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-clear-filters-button',
  templateUrl: './clear-filters-button.component.html',
  styleUrls: ['./clear-filters-button.component.scss'],
  standalone: false,
})
export class ClearFiltersButtonComponent implements OnInit {
  constructor(
    public time: TimeService,
    public themes: ThemeService,
    public filters: FilterService,
    public organisationFilter: OrganisationFilterService,
  ) {}

  ngOnInit(): void {}

  hasActiveFilters(): boolean {
    return this.time.isActive() || this.themes.isActive() || this.organisationFilter.isActive();
  }

  clearFilters($event: MouseEvent) {
    $event.stopPropagation();
    this.time.setToDefaultRange();
    this.themes.clearSelection();
    this.organisationFilter.clearSelection();

    setTimeout(() => {
      this.filters.hide();
    }, 200);
  }
}
