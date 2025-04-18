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
    this.shownStory.next(undefined);
  }

  private async _updateShownStoryDetailsFromServer(storyAlias: string) {
    console.log('(story) Retrieving Nid from URL alias', storyAlias + '...');

    const storyNid: string = await this.api.getNidFromUrlAlias(
      '/story/' + storyAlias
    );

    const storyDetails: Story | undefined = await this.api.getStoryDetailsById(
      storyNid
    );
    if (storyDetails) {
      const mediaItems: MediaItem[] | undefined =
        await this.api.getMediaItemsByStoryId(storyNid);
      storyDetails.mediaItems = mediaItems;

      this.shownStory.next(storyDetails);
    }
  }

  showView() {
    this.showingStoryView.next(true);
  }

  hideView() {
    this.showingStoryView.next(false);
  }
}
