import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { SelectedRouteComponent } from './selected-route/selected-route.component';

@NgModule({
  declarations: [RoutesComponent, SelectedRouteComponent],
  imports: [CommonModule],
})
export class RoutesModule {}
