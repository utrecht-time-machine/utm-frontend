import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'locaties', component: MapComponent },
  { path: 'locaties/:id', component: MapComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
