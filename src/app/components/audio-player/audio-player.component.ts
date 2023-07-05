import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Howl } from 'howler';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent {
  scrubbingAudio = false;
  percentageComplete = 0;
  audio: Howl | undefined;

  @Input() audioUrl: string | undefined;

  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  constructor() {
    setInterval(() => {
      this.percentageComplete = this._getPercentageComplete();
    }, 50);
  }

  ngOnInit() {
    this.load(this.audioUrl);
  }

  onAudioBarScrubbed(event: any) {
    if (!event.target || !this.scrubbingAudio) {
      return;
    }

    this.setAudioTimeByClickLocation(event);
  }

  onAudioBarClicked(event: any) {
    if (!event.target) {
      return;
    }

    this.setAudioTimeByClickLocation(event);
  }

  setAudioTimeByClickLocation(event: any) {
    const audioBarElem = event.target;
    const boundingRect = audioBarElem.getBoundingClientRect();
    const clickX = event.clientX - boundingRect.left;
    const percentage = (clickX / boundingRect.width) * 100;

    this.setTimeByPercentage(percentage);
  }

  onAudioBarStartScrubbing() {
    this.scrubbingAudio = true;
  }

  onAudioBarStopScrubbing() {
    this.scrubbingAudio = false;
  }

  load(audioUrl: string | undefined) {
    if (this.audio) {
      this.audio.stop();
      this.audio.unload();
    }

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
