import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectComponent } from './theme-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { FilterExpandedModule } from '../filter-expanded.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ThemeSelectComponent],
  exports: [ThemeSelectComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FilterExpandedModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class ThemeSelectModule {}
