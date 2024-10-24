import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeButtonComponent } from './theme-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { FilterButtonModule } from '../filter-button.module';

@NgModule({
  declarations: [ThemeButtonComponent],
  exports: [ThemeButtonComponent],
  imports: [CommonModule, TranslateModule, FilterButtonModule],
})
export class ThemeButtonModule {}
