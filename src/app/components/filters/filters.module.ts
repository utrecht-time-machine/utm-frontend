import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeFilterModule } from './filter-expanded/theme-filter/theme-filter.module';
import { TimeSliderSelectModule } from './filter-expanded/time-slider-select/time-slider-select.module';

@NgModule({
  declarations: [FiltersComponent],
  imports: [CommonModule, ThemeFilterModule, TimeSliderSelectModule],
  exports: [FiltersComponent],
})
export class FiltersModule {}
