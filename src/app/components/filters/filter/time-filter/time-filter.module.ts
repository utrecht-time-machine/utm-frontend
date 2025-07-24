import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFilterComponent } from './time-filter.component';
import { FilterModule } from '../filter.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [TimeFilterComponent],
  exports: [TimeFilterComponent],
  imports: [
    CommonModule,
    FilterModule,
    TranslateModule,
    MatSliderModule,
    FormsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSlideToggleModule,
  ],
})
export class TimeFilterModule {}
