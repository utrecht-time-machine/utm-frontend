import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapUiExpandedComponent } from './map-ui-expanded.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MapUiExpandedComponent],
  imports: [CommonModule, TranslateModule, MatIconModule],
  exports: [MapUiExpandedComponent],
})
export class MapUiExpandedModule {}
