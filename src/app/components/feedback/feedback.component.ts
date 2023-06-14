import { Component, Input } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackRating } from '../../models/feedback-rating';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @Input() storyId: string | undefined;
  FeedbackRating = FeedbackRating;

  constructor(public feedbackService: FeedbackService) {}

  getRating(): FeedbackRating | undefined {
    if (!this.storyId) {
      return undefined;
    }

    return this.feedbackService.getStoryRating(this.storyId);
  }

  feedbackHasBeenGiven(): boolean {
    if (!this.storyId) {
      return false;
    }

    return this.feedbackService.getStoryRating(this.storyId) !== undefined;
  }
}
