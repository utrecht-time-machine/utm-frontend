import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapUiExpandedComponent } from './map-ui-expanded.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MapUiExpandedComponent],
  imports: [CommonModule, TranslateModule],
  exports: [MapUiExpandedComponent],
})
export class MapUiExpandedModule {}
