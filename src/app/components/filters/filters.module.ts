import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeFilterModule } from './filter/theme-filter/theme-filter.module';
import { TimeFilterModule } from './filter/time-filter/time-filter.module';
import { FiltersHeaderComponent } from './filters-header/filters-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClearFiltersButtonComponent } from './clear-filters-button/clear-filters-button.component';
import { ActiveFiltersBadgeComponent } from './active-filters-badge/active-filters-badge.component';
import { OrganisationFilterModule } from "./filter/organisation-filter/organisation-filter.module";

@NgModule({
  declarations: [
    FiltersComponent,
    ClearFiltersButtonComponent,
    ActiveFiltersBadgeComponent,
  ],
  imports: [
    CommonModule,
    ThemeFilterModule,
    TimeFilterModule,
    FiltersHeaderComponent,
    TranslateModule,
    OrganisationFilterModule
],
  exports: [FiltersComponent],
})
export class FiltersModule {}
