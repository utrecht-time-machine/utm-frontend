import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SelectedView } from '../models/selected-view';
import { StoryService } from './story.service';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(public router: Router, private story: StoryService) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url.startsWith('/story')) {
          this.story.showView();
        } else {
          this.story.hideView();
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

    if (this.story.showingStoryView.getValue()) {
      return SelectedView.Story;
    }

    return SelectedView.Undefined;
  }
}
