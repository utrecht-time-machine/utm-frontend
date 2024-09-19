import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapUiButtonComponent } from './map-ui-button.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MapUiButtonComponent],
  exports: [MapUiButtonComponent],
  imports: [CommonModule, MatIconModule],
})
export class MapUiButtonModule {}
