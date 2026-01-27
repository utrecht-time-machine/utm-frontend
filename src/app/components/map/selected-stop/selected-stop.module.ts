import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedStopComponent } from './selected-stop.component';
import { SafeModule } from '../../../pipes/safe.module';
import { MediaItemModule } from '../media-item/media-item.module';
import { EditButtonModule } from '../../edit-button/edit-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackModule } from '../../feedback/feedback.module';
import { AudioPlayerModule } from '../../audio-player/audio-player.module';
import { AudioTranscriptComponent } from '../../audio-transcript/audio-transcript.component';
import { RouteNotificationsToggleComponent } from '../route-notifications-toggle/route-notifications-toggle.component';

@NgModule({
  declarations: [SelectedStopComponent],
  imports: [
    CommonModule,
    SafeModule,
    MediaItemModule,
    EditButtonModule,
    TranslateModule,
    FeedbackModule,
    AudioPlayerModule,
    AudioTranscriptComponent,
    RouteNotificationsToggleComponent,
  ],
  exports: [SelectedStopComponent],
})
export class SelectedStopModule {}
