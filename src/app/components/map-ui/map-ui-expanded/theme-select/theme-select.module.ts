import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectComponent } from './theme-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapUiExpandedModule } from '../map-ui-expanded.module';

@NgModule({
  declarations: [ThemeSelectComponent],
  exports: [ThemeSelectComponent],
  imports: [CommonModule, TranslateModule, MapUiExpandedModule],
})
export class ThemeSelectModule {}
