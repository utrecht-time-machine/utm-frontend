import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FeedbackComponent],
  exports: [FeedbackComponent],
  imports: [CommonModule, TranslateModule],
})
export class FeedbackModule {}
