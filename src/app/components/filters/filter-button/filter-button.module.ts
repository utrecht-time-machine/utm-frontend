import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterButtonComponent } from './filter-button.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FilterButtonComponent],
  exports: [FilterButtonComponent],
  imports: [CommonModule, MatIconModule],
})
export class FilterButtonModule {}
