import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  audio: Howl | undefined;

  percentageComplete = 0;

  constructor() {
    setInterval(() => {
      this.percentageComplete = this._getPercentageComplete();
    }, 50);
  }

  load(audioUrl: string | undefined) {
    if (this.audio) {
      this.audio.stop();
      this.audio.unload();
    }

    console.log('Loading audio', audioUrl);
    if (!audioUrl) {
      return;
    }

    this.audio = new Howl({
      src: [audioUrl],
    });
  }

  togglePlayPause() {
    if (!this.audio) {
      return;
    }

    if (this.audio.playing()) {
      console.log('Pausing audio');
      this.audio.pause();
    } else {
      console.log('Playing audio');
      this.audio.play();
    }
  }

  setTimeByPercentage(percentage: number) {
    if (!this.audio) {
      return;
    }

    console.log(percentage);
    if (percentage < 0) {
      percentage = 0;
    }
    if (percentage >= 100) {
      return;
    }

    const secondsTimeToJumpTo = this.audio.duration() * (percentage / 100);
    this.audio.seek(secondsTimeToJumpTo);
  }
  get isPlaying() {
    return this.audio?.playing();
  }

  get formattedPlayTime(): string {
    if (!this.audio) {
      return '';
    }

    return this._formatTime(Math.round(this.audio.seek()));
  }

  get formattedDuration(): string {
    if (!this.audio) {
      return '';
    }

    return this._formatTime(Math.round(this.audio.duration()));
  }

  private _formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(remainingSeconds).padStart(2, '0');

    return `${minutesString}:${secondsString}`;
  }

  private _getPercentageComplete(): number {
    if (!this.audio) {
      return 0;
    }
    return (this.audio.seek() / this.audio.duration()) * 100;
  }
}
