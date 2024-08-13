import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectComponent } from './theme-select.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ThemeSelectComponent],
  exports: [ThemeSelectComponent],
  imports: [CommonModule, TranslateModule],
})
export class ThemeSelectModule {}
