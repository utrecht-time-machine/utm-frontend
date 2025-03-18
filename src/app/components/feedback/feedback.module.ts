import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackComponent],
  exports: [FeedbackComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
})
export class FeedbackModule {}
