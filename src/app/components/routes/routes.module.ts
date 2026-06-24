import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesComponent } from './routes.component';
import { SelectedRouteComponent } from './selected-route/selected-route.component';
import { TranslateModule } from '@ngx-translate/core';
import { FiltersModule } from '../filters/filters.module';

@NgModule({
  declarations: [RoutesComponent, SelectedRouteComponent],
  imports: [CommonModule, FormsModule, TranslateModule, FiltersModule],
})
export class RoutesModule {}
