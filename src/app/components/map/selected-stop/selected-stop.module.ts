import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedStopComponent } from './selected-stop.component';
import { SafeModule } from '../../../pipes/safe.module';
import { MediaItemModule } from '../media-item/media-item.module';
import { EditButtonModule } from '../../edit-button/edit-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { FeedbackModule } from '../../feedback/feedback.module';

@NgModule({
  declarations: [SelectedStopComponent],
  imports: [
    CommonModule,
    SafeModule,
    MediaItemModule,
    EditButtonModule,
    TranslateModule,
    FeedbackModule,
  ],
  exports: [SelectedStopComponent],
})
export class SelectedStopModule {}
