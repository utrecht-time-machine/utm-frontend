import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeButtonComponent } from './theme-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapUiButtonModule } from '../map-ui-button.module';

@NgModule({
  declarations: [ThemeButtonComponent],
  exports: [ThemeButtonComponent],
  imports: [CommonModule, TranslateModule, MapUiButtonModule],
})
export class ThemeButtonModule {}
