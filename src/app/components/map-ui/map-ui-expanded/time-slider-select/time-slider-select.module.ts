import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSliderSelectComponent } from './time-slider-select.component';
import { MapUiExpandedModule } from '../map-ui-expanded.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimeSliderSelectComponent],
  exports: [TimeSliderSelectComponent],
  imports: [
    CommonModule,
    MapUiExpandedModule,
    TranslateModule,
    MatSliderModule,
    FormsModule,
  ],
})
export class TimeSliderSelectModule {}
