import { Injectable } from '@angular/core';
import { FeedbackRating } from '../models/feedback-rating';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  readonly LOCAL_STORAGE_FEEDBACK_KEY = 'utrechtTimeMachineFeedback';

  ratingsPerStory: { [storyId: string]: FeedbackRating } = {};

  constructor() {
    const localStorageRatings = localStorage.getItem(
      this.LOCAL_STORAGE_FEEDBACK_KEY
    );
    if (localStorageRatings) {
      this.ratingsPerStory = JSON.parse(localStorageRatings);
    }
  }

  rateStory(storyId: string, rating: FeedbackRating) {
    console.log('Rating', storyId, rating);
    this.ratingsPerStory[storyId] = rating;

    localStorage.setItem(
      this.LOCAL_STORAGE_FEEDBACK_KEY,
      JSON.stringify(this.ratingsPerStory)
    );
  }

  getStoryRating(storyId: string): FeedbackRating | undefined {
    if (storyId in this.ratingsPerStory) {
      return this.ratingsPerStory[storyId];
    }
    return undefined;
  }
}
