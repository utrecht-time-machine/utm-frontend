import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story.component';
import { MediaItemModule } from '../media-item/media-item.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackModule } from '../../feedback/feedback.module';
import { EditButtonModule } from '../../edit-button/edit-button.module';
import { UnescapeModule } from '../../../pipes/unescape.module';
import { AudioPlayerModule } from '../../audio-player/audio-player.module';

@NgModule({
  declarations: [StoryComponent],
  exports: [StoryComponent],
  imports: [
    CommonModule,
    MediaItemModule,
    TranslateModule,
    FeedbackModule,
    EditButtonModule,
    UnescapeModule,
    AudioPlayerModule,
  ],
})
export class StoryModule {}
