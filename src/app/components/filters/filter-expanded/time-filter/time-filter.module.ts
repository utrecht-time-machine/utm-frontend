import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFilterComponent } from './time-filter.component';
import { FilterExpandedModule } from '../filter-expanded.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [TimeFilterComponent],
  exports: [TimeFilterComponent],
  imports: [
    CommonModule,
    FilterExpandedModule,
    TranslateModule,
    MatSliderModule,
    FormsModule,
    MatCheckboxModule,
  ],
})
export class TimeFilterModule {}
