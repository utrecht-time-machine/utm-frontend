import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FilterComponent],
  imports: [CommonModule, TranslateModule, MatIconModule],
  exports: [FilterComponent],
})
export class FilterModule {}
