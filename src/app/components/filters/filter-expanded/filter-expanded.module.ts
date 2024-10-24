import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterExpandedComponent } from './filter-expanded.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FilterExpandedComponent],
  imports: [CommonModule, TranslateModule, MatIconModule],
  exports: [FilterExpandedComponent],
})
export class FilterExpandedModule {}
