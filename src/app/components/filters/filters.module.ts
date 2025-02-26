import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeSelectModule } from './filter-expanded/theme-select/theme-select.module';
import { TimeSliderSelectModule } from './filter-expanded/time-slider-select/time-slider-select.module';

@NgModule({
  declarations: [FiltersComponent],
  imports: [CommonModule, ThemeSelectModule, TimeSliderSelectModule],
  exports: [FiltersComponent],
})
export class FiltersModule {}
