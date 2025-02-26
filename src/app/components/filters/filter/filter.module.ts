import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterHeaderComponent } from "./filter-header/filter-header.component";

@NgModule({
  declarations: [FilterComponent],
  imports: [CommonModule, TranslateModule, MatIconModule, FilterHeaderComponent],
  exports: [FilterComponent],
})
export class FilterModule {}
