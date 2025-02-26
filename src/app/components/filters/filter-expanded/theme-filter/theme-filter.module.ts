import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeFilterComponent } from './theme-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { FilterExpandedModule } from '../filter-expanded.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ThemeFilterComponent],
  exports: [ThemeFilterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FilterExpandedModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
  ],
})
export class ThemeFilterModule {}
