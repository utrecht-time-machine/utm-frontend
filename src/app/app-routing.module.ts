import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { RoutesComponent } from './components/routes/routes.component';
import { AboutComponent } from './components/about/about.component';
import { qrCodeRoutes } from '../assets/routing/qr-code-routes';
import { previousUtmRoutes } from '../assets/routing/previous-utm-routes';
import { HomeComponent } from './components/home/home.component';
import { ArComponent } from './components/ar/ar.component';

const rootGuard = () => {
  // Determine if user saw introduction by checking local storage
  const hasSeenIntro = localStorage.getItem('hasSeenIntro');

  const router = inject(Router);
  if (!hasSeenIntro) {
    router.navigate(['intro']);
    localStorage.setItem('hasSeenIntro', 'true');
  } else {
    router.navigate(['locaties']); // Default URL when intro seen
  }
};

export const routes: Routes = [
  ...qrCodeRoutes,
  ...previousUtmRoutes,
  {
    path: '',
    component: MapComponent,
    canActivate: [rootGuard],
  },
  { path: 'intro', component: HomeComponent },
  { path: 'locaties', component: MapComponent },
  { path: 'locaties/:id', component: MapComponent },
  { path: 'locaties/:id/:storyId', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'routes/:id', component: MapComponent },
  { path: 'story/:id', component: MapComponent },
  { path: 'over', component: AboutComponent },
  { path: 'AR', component: ArComponent },
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
