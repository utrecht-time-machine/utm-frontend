import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Story } from '../models/story';
import { ApiService } from './api.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.showingStoryView.subscribe(async (showingStoryView) => {
      if (!showingStoryView) {
        this._resetShownStory();
        return;
      }

      if (showingStoryView) {
        this.route.queryParams.subscribe(async (urlParams) => {
          const storyAlias: string = urlParams['story'];
          if (storyAlias) {
            await this._updateShownStoryDetailsFromServer(storyAlias);
            return;
          }

          const storyUrl = this.router.url;
          if (storyUrl) {
            await this._updateShownStoryDetailsFromServer(
              storyUrl.replace('/story/', '')
            );
          } else {
            this._resetShownStory();
          }
        });
      }
    });
  }

  private _resetShownStory() {
    this.shownStoryMediaItems.next([]);
    this.shownStory.next(undefined);
  }

  private async _updateShownStoryDetailsFromServer(storyAlias: string) {
    const storyNid: string = await this.api.getNidFromUrlAlias(
      '/story/' + storyAlias
    );

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
    this.showingStoryView.next(true);
  }

  hideView() {
    this.showingStoryView.next(false);
  }
}
