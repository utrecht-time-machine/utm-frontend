import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Story } from '../models/story';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { MediaItem } from '../models/media-item';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  shownStory: BehaviorSubject<Story | undefined> = new BehaviorSubject<
    Story | undefined
  >(undefined);
  shownStoryMediaItems: BehaviorSubject<MediaItem[]> = new BehaviorSubject<
    MediaItem[]
  >([]);
  showingStoryView: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private api: ApiService, private router: Router) {
    this.showingStoryView.subscribe((storyViewIsShown) => {
      if (storyViewIsShown) {
        void this._updateShownStoryDetailsFromServer();
      } else {
        this.shownStoryMediaItems.next([]);
        this.shownStory.next(undefined);
      }
    });
  }

  private async _updateShownStoryDetailsFromServer() {
    const storyNid: string = await this.api.getNidFromUrlAlias(this.router.url);

    this.api
      .getStoryDetailsById(storyNid)
      .then((storyDetails: Story | undefined) =>
        this.shownStory.next(storyDetails)
      );

    this.api
      .getMediaItemsByStoryId(storyNid)
      .then((mediaItems: MediaItem[]) =>
        this.shownStoryMediaItems.next(mediaItems)
      );
  }

  showView() {
    document.getElementsByTagName('body')[0].classList.add('dock-story-on');
    this.showingStoryView.next(true);
  }

  hideView() {
    document.getElementsByTagName('body')[0].classList.remove('dock-story-on');
    this.showingStoryView.next(false);
  }
}
