import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeFilterModule } from './filter/theme-filter/theme-filter.module';
import { TimeFilterModule } from './filter/time-filter/time-filter.module';
import { FiltersHeaderComponent } from './filters-header/filters-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClearFiltersButtonComponent } from './clear-filters-button/clear-filters-button.component';

@NgModule({
  declarations: [FiltersComponent, ClearFiltersButtonComponent],
  imports: [
    CommonModule,
    ThemeFilterModule,
    TimeFilterModule,
    FiltersHeaderComponent,
    TranslateModule,
  ],
  exports: [FiltersComponent],
})
export class FiltersModule {}
