import { inject, NgModule } from '@angular/core';
import {
  Router,
  RouterModule,
  Routes,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { RoutesComponent } from './components/routes/routes.component';
import { StaticPageComponent } from './components/static-page/static-page.component';
import { qrCodeRoutes } from '../assets/routing/qr-code-routes';
import { previousUtmRoutes } from '../assets/routing/previous-utm-routes';
import { HomeComponent } from './components/home/home.component';
import { ApiService } from './services/api.service';

export const DEFAULT_HOME_URL = '/intro';

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

const staticPageResolver = async (route: ActivatedRouteSnapshot) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const path = '/' + route.url.map((segment) => segment.path).join('/');

  try {
    const nid = await apiService.getNidFromUrlAlias(path);
    return { nid };
  } catch (error) {
    void router.navigate([DEFAULT_HOME_URL]);
    return null;
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
  {
    path: 'intro',
    component: HomeComponent,
  },
  { path: 'locaties', component: MapComponent },
  { path: 'locaties/:id', component: MapComponent },
  { path: 'locaties/:id/:storyId', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'routes/:id', component: MapComponent },
  { path: 'story/:id', component: MapComponent },
  {
    path: '**',
    component: StaticPageComponent,
    resolve: {
      pageData: staticPageResolver,
    },
  },
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
