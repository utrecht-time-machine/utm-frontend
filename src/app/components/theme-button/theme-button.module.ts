import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeButtonComponent } from './theme-button.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ThemeButtonComponent],
  exports: [ThemeButtonComponent],
  imports: [CommonModule, TranslateModule],
})
export class ThemeButtonModule {}
