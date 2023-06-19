import { Injectable } from '@angular/core';
import { FeedbackRating } from '../models/feedback-rating';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  readonly LOCAL_STORAGE_FEEDBACK_KEY = 'utrechtTimeMachineFeedback';

  ratingsPerStory: { [storyId: string]: FeedbackRating } = {};

  constructor(private apiService: ApiService) {
    const localStorageRatings = window.localStorage.getItem(
      this.LOCAL_STORAGE_FEEDBACK_KEY
    );
    if (localStorageRatings) {
      this.ratingsPerStory = JSON.parse(localStorageRatings);
    }
  }

  async rateStory(storyId: string, rating: FeedbackRating) {
    if (!storyId) {
      console.warn('No story ID passed...');
      return;
    }

    // console.log('Sending feedback', storyId, rating);

    this.ratingsPerStory[storyId] = rating;

    window.localStorage.setItem(
      this.LOCAL_STORAGE_FEEDBACK_KEY,
      JSON.stringify(this.ratingsPerStory)
    );

    const postResult = await this.apiService.post(environment.feedbackPostUrl, {
      storyId: storyId,
      rating: rating,
    });
  }

  getStoryRating(storyId: string): FeedbackRating | undefined {
    if (storyId in this.ratingsPerStory) {
      return this.ratingsPerStory[storyId];
    }
    return undefined;
  }
}
