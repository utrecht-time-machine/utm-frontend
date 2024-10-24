import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSliderButtonComponent } from './time-slider-button.component';
import { FilterButtonModule } from '../filter-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TimeSliderButtonComponent],
  imports: [CommonModule, FilterButtonModule, TranslateModule],
  exports: [TimeSliderButtonComponent],
})
export class TimeSliderButtonModule {}
