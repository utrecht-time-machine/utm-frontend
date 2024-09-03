import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSliderSelectComponent } from './time-slider-select.component';
import { MapUiExpandedModule } from '../map-ui-expanded.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TimeSliderSelectComponent],
  exports: [TimeSliderSelectComponent],
  imports: [CommonModule, MapUiExpandedModule, TranslateModule],
})
export class TimeSliderSelectModule {}
