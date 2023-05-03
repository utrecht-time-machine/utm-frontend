import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SelectedItemComponent } from './selected-item/selected-item.component';
import { RouterModule } from '@angular/router';
import { SelectedRouteComponent } from './selected-route/selected-route.component';
import { RouteStepsComponent } from './route-steps/route-steps.component';

@NgModule({
  declarations: [MapComponent, SelectedItemComponent, SelectedRouteComponent, RouteStepsComponent],
  exports: [MapComponent],
  imports: [CommonModule, RouterModule],
})
export class MapModule {}
