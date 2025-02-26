import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeFilterModule } from './filter/theme-filter/theme-filter.module';
import { TimeFilterModule } from './filter/time-filter/time-filter.module';

@NgModule({
  declarations: [FiltersComponent],
  imports: [CommonModule, ThemeFilterModule, TimeFilterModule],
  exports: [FiltersComponent],
})
export class FiltersModule {}
