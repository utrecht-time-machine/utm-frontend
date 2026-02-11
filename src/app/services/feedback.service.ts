import { Injectable } from '@angular/core';
import { FeedbackRating } from '../models/feedback-rating';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  readonly LOCAL_STORAGE_FEEDBACK_KEY = 'utrechtTimeMachineFeedback';

  ratingsPerItem: { [itemId: string]: FeedbackRating } = {};

  constructor(private apiService: ApiService, private platform: PlatformService) {
    const localStorageRatings: string | null = null;

    if (this.platform.isBrowser()) {
      window.localStorage.getItem(this.LOCAL_STORAGE_FEEDBACK_KEY);
    }

    if (localStorageRatings) {
      this.ratingsPerItem = JSON.parse(localStorageRatings);
    }
  }

  async comment(itemId: string, comment: string) {
    if (!itemId) {
      console.warn('No item ID passed...');
      return;
    }

    console.log('Sending comment', itemId, comment);

    const postResult = await this.apiService.post(environment.commentPostUrl, {
      itemId: itemId,
      comment: comment,
    });
  }

  async rateItem(itemId: string, rating: FeedbackRating) {
    if (!itemId) {
      console.warn('No item ID passed...');
      return;
    }

    // console.log('Sending feedback', itemId, rating);

    this.ratingsPerItem[itemId] = rating;

    if (this.platform.isBrowser()) {
      window.localStorage.setItem(
        this.LOCAL_STORAGE_FEEDBACK_KEY,
        JSON.stringify(this.ratingsPerItem),
      );
    }

    const postResult = await this.apiService.post(environment.feedbackPostUrl, {
      itemId: itemId,
      rating: rating,
    });
  }

  getItemRating(itemId: string): FeedbackRating | undefined {
    if (itemId in this.ratingsPerItem) {
      return this.ratingsPerItem[itemId];
    }
    return undefined;
  }
}
