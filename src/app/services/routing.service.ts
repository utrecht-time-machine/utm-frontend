import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(public router: Router) {}

  locationsPageIsSelected(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/locaties');
  }

  routesPageIsSelected(): boolean {
    return this.router.url.startsWith('/routes');
  }

  aboutPageIsSelected(): boolean {
    return this.router.url.startsWith('/over');
  }
}
