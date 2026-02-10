import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { SelectedRouteComponent } from './selected-route/selected-route.component';
import { TranslateModule } from '@ngx-translate/core';
import { FiltersModule } from '../filters/filters.module';

@NgModule({
  declarations: [RoutesComponent, SelectedRouteComponent],
  imports: [CommonModule, TranslateModule, FiltersModule],
})
export class RoutesModule {}
