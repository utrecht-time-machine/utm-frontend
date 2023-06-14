import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story.component';
import { MediaItemModule } from '../media-item/media-item.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackModule } from '../../feedback/feedback.module';

@NgModule({
  declarations: [StoryComponent],
  exports: [StoryComponent],
  imports: [CommonModule, MediaItemModule, TranslateModule, FeedbackModule],
})
export class StoryModule {}
