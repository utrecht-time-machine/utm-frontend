import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SelectedView } from '../models/selected-view';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(public router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (this.getSelectedView() === SelectedView.Story) {
          this.showStoryView();
        } else {
          this.hideStoryView();
        }
      }
    });
  }

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

    if (this.router.url.startsWith('/story')) {
      return SelectedView.Story;
    }

    return SelectedView.Undefined;
  }

  showStoryView() {
    document.getElementsByTagName('body')[0].classList.add('dock-story-on');
  }

  hideStoryView() {
    document.getElementsByTagName('body')[0].classList.remove('dock-story-on');
  }
}
