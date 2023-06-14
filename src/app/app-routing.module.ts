import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { RoutesComponent } from './components/routes/routes.component';
import { AboutComponent } from './components/about/about.component';
import { qrCodeRoutes } from '../assets/routing/qr-code-routes';

export const routes: Routes = [
  ...qrCodeRoutes,
  { path: '', component: MapComponent },
  { path: 'locaties', component: MapComponent },
  { path: 'locaties/:id', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'routes/:id', component: MapComponent },
  { path: 'story/:id', component: MapComponent },
  { path: 'over', component: AboutComponent },
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
