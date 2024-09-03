import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSliderButtonComponent } from './time-slider-button.component';
import { MapUiButtonModule } from '../map-ui-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TimeSliderButtonComponent],
  imports: [CommonModule, MapUiButtonModule, TranslateModule],
  exports: [TimeSliderButtonComponent],
})
export class TimeSliderButtonModule {}
