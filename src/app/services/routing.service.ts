import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedView } from '../models/selected-view';
import { StoryService } from './story.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  public readonly selectedView = new BehaviorSubject<SelectedView>(
    SelectedView.Undefined
  );

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private story: StoryService
  ) {
    this.route.queryParams.subscribe((params) => {
      const storyId = params['story'];
      if (storyId) {
        this.story.showView();
      } else {
        this.story.hideView();
      }
    });
  }

  private determineSelectedView(): SelectedView {
    if (this.router.url === '/' || this.router.url.startsWith('/locaties')) {
      return SelectedView.Locations;
    }

    if (this.router.url.startsWith('/routes/')) {
      return SelectedView.SelectedRoute;
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

  getSelectedView(): SelectedView {
    const currentView = this.determineSelectedView();
    if (this.selectedView.getValue() !== currentView) {
      this.selectedView.next(currentView);
    }
    return currentView;
  }
}
