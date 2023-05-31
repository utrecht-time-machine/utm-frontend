import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { SelectedRouteComponent } from './selected-route/selected-route.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RoutesComponent, SelectedRouteComponent],
  imports: [CommonModule, TranslateModule],
})
export class RoutesModule {}
