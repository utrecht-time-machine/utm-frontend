import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedStopComponent } from './selected-stop.component';
import { SafeModule } from '../../../pipes/safe.module';
import { MediaItemModule } from '../media-item/media-item.module';
import { EditButtonModule } from '../../edit-button/edit-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackModule } from '../../feedback/feedback.module';
import { StoryPreviewModule } from '../story-preview/story-preview.module';

@NgModule({
  declarations: [SelectedStopComponent],
  imports: [
    CommonModule,
    SafeModule,
    MediaItemModule,
    EditButtonModule,
    TranslateModule,
    FeedbackModule,
    StoryPreviewModule,
  ],
  exports: [SelectedStopComponent],
})
export class SelectedStopModule {}
