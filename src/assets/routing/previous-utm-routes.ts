import { Route } from '@angular/router';

export const previousUtmRoutes: Route[] = [
  {
    path: ':lang/location/:id',
    redirectTo: 'locaties/:id',
    pathMatch: 'full',
  },
  {
    path: ':lang/location',
    redirectTo: 'locaties',
    pathMatch: 'full',
  },
  {
    path: ':lang/home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: ':lang/about',
    redirectTo: 'over',
    pathMatch: 'full',
  },
  {
    path: ':lang/series/:id',
    redirectTo: 'routes/:id',
    pathMatch: 'full',
  },
  {
    path: ':lang/series',
    redirectTo: 'routes',
    pathMatch: 'full',
  },
  {
    path: ':lang/over',
    redirectTo: 'over',
    pathMatch: 'full',
  },
  {
    path: ':lang/story/:id', // TODO: Not functioning yet!
    redirectTo: 'story/:id',
    pathMatch: 'full',
  },
  {
    path: 'nl/:param',
    redirectTo: ':param',
    pathMatch: 'prefix',
  },
  {
    path: 'en/:param',
    redirectTo: ':param',
    pathMatch: 'prefix',
  },
];
