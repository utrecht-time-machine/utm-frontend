import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { ThemeButtonModule } from './filter-button/theme-button/theme-button.module';
import { ThemeSelectModule } from './filter-expanded/theme-select/theme-select.module';
import { TimeSliderButtonModule } from './filter-button/time-slider-button/time-slider-button.module';
import { TimeSliderSelectModule } from './filter-expanded/time-slider-select/time-slider-select.module';

@NgModule({
  declarations: [FiltersComponent],
  imports: [
    CommonModule,
    ThemeButtonModule,
    ThemeSelectModule,
    TimeSliderButtonModule,
    TimeSliderSelectModule,
  ],
  exports: [FiltersComponent],
})
export class FiltersModule {}
