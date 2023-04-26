import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SelectedItemComponent } from './selected-item/selected-item.component';

@NgModule({
  declarations: [MapComponent, SelectedItemComponent],
  exports: [MapComponent],
  imports: [CommonModule],
})
export class MapModule {}
