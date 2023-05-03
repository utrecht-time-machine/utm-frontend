import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SelectedItemComponent } from './selected-item/selected-item.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MapComponent, SelectedItemComponent],
  exports: [MapComponent],
  imports: [CommonModule, RouterModule],
})
export class MapModule {}
