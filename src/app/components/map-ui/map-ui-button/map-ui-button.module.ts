import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapUiButtonComponent } from './map-ui-button.component';

@NgModule({
  declarations: [MapUiButtonComponent],
  exports: [MapUiButtonComponent],
  imports: [CommonModule],
})
export class MapUiButtonModule {}
