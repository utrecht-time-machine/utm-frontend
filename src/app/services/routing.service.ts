import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedView } from '../models/selected-view';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(public router: Router) {}

  getSelectedView(): SelectedView {
    if (this.router.url === '/' || this.router.url.startsWith('/locaties')) {
      return SelectedView.Locations;
    }

    if (this.router.url.startsWith('/routes')) {
      return SelectedView.Routes;
    }

    if (this.router.url.startsWith('/over')) {
      return SelectedView.About;
    }

    return SelectedView.Undefined;
  }
}
