import { Component, Input } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackRating } from '../../models/feedback-rating';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @Input() feedbackItemId: string | undefined;
  @Input() feedbackQuestionText: string | undefined;
  @Input() feedbackGivenText: string | undefined;

  FeedbackRating = FeedbackRating;

  constructor(public feedbackService: FeedbackService) {}

  getRating(): FeedbackRating | undefined {
    if (!this.feedbackItemId) {
      return undefined;
    }

    return this.feedbackService.getItemRating(this.feedbackItemId);
  }

  feedbackHasBeenGiven(): boolean {
    if (!this.feedbackItemId) {
      return false;
    }

    return (
      this.feedbackService.getItemRating(this.feedbackItemId) !== undefined
    );
  }
}
