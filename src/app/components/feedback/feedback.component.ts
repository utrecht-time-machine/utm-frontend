import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackRating } from '../../models/feedback-rating';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FeedbackComponent {
  @Input() feedbackItemId: string | undefined;
  @Input() feedbackQuestionText: string | undefined;
  @Input() feedbackGivenText: string | undefined;

  FeedbackRating = FeedbackRating;

  commentText: string = '';
  isSubmittingComment = false;
  commentSubmitStatus: 'none' | 'success' | 'error' = 'none';
  commentSubmitMessage = '';
  private commentSubmitStatusTimeout: number | null = null;
  private commentStatusMessageHideAfterMs: number = 1500;

  constructor(public feedbackService: FeedbackService) {}

  getRating(): FeedbackRating | undefined {
    if (!this.feedbackItemId) {
      return undefined;
    }

    return this.feedbackService.getItemRating(this.feedbackItemId);
  }

  ratingHasBeenGiven(): boolean {
    if (!this.feedbackItemId) {
      return false;
    }

    return (
      this.feedbackService.getItemRating(this.feedbackItemId) !== undefined
    );
  }

  private showStatusMessage(status: 'success' | 'error', message: string) {
    this.commentSubmitStatus = status;
    this.commentSubmitMessage = message;

    if (this.commentSubmitStatusTimeout !== null) {
      window.clearTimeout(this.commentSubmitStatusTimeout);
    }

    this.commentSubmitStatusTimeout = window.setTimeout(() => {
      if (this.commentSubmitStatus !== 'none') {
        this.commentSubmitStatus = 'none';
        this.commentSubmitMessage = '';
      }
      this.commentSubmitStatusTimeout = null;
    }, this.commentStatusMessageHideAfterMs);
  }

  async submitComment() {
    if (this.isSubmittingComment || !this.feedbackItemId) return;

    this.isSubmittingComment = true;

    try {
      await this.feedbackService.comment(this.feedbackItemId, this.commentText);
      this.showStatusMessage('success', 'Feedback verstuurd');
      this.commentText = '';
    } catch (error) {
      this.showStatusMessage('error', 'Er ging iets mis');
    }

    this.isSubmittingComment = false;
  }
}
