import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player.component';
import { AudioTranscriptComponent } from '../audio-transcript/audio-transcript.component';

@NgModule({
  declarations: [AudioPlayerComponent],
  exports: [AudioPlayerComponent],
  imports: [CommonModule, AudioTranscriptComponent],
})
export class AudioPlayerModule {}
