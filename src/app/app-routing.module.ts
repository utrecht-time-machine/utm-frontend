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

import { PlatformService } from './services/platform.service';

const rootGuard = () => {
  const platformService = inject(PlatformService);

  let hasSeenIntro: boolean = false;
  if (platformService.isBrowser()) {
    hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  }

  const router = inject(Router);
  if (!hasSeenIntro) {
    router.navigate(['intro']);

    if (platformService.isBrowser()) {
      localStorage.setItem('hasSeenIntro', 'true');
    }
  } else {
    router.navigate(['locaties']); // Default URL when intro seen
  }
};

// const staticPageResolver = async (route: ActivatedRouteSnapshot) => {
//   const apiService = inject(ApiService);
//   const path = '/' + route.url.map((segment) => segment.path).join('/');

//   try {
//     console.log('Retrieving static page Nid from URL alias', path + '...');
//     const nid = await apiService.getNidFromUrlAlias(path);
//     return { nid };
//   } catch (error) {
//     console.error(
//       'Error retrieving static page Nid from URL alias',
//       path,
//       error
//     );
//     return { nid: null };
//   }
// };

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
    path: 'over',
    component: StaticPageComponent,
    data: { pageData: { nid: '20723' } },
  },
  {
    path: 'provincie',
    component: StaticPageComponent,
    data: { pageData: { nid: '22886' } },
  },
  {
    path: 'privacy',
    component: StaticPageComponent,
    data: { pageData: { nid: '20725' } },
  },
  {
    path: '**',
    component: StaticPageComponent,
    data: { pageData: { nid: '22887' } },
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
