import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Howl } from 'howler';
import { PlatformService } from 'src/app/services/platform.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  standalone: false,
})
export class AudioPlayerComponent implements OnInit, OnDestroy, OnChanges {
  scrubbingAudio = false;
  percentageComplete = 0;
  audio: Howl | undefined;

  @Input() audioUrl: string | undefined;
  @Input() transcript?: string;

  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  constructor(public platform: PlatformService) {
    if (this.platform.isBrowser()) {
      setInterval(() => {
        this.percentageComplete = this._getPercentageComplete();
      }, 50);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['audioUrl']) {
      this.load(this.audioUrl);
    }
  }

  ngOnInit() {
    this.load(this.audioUrl);
  }

  ngOnDestroy() {
    this.audio?.stop();
    this.audio?.unload();
  }

  onAudioBarScrubbed(event: any) {
    if (!event.target || !this.scrubbingAudio) {
      return;
    }

    event.preventDefault();
    this.setAudioTimeByClickLocation(event);
  }

  onAudioBarClicked(event: any) {
    if (!event.target) {
      return;
    }

    event.preventDefault();
    // Only handle click events if we're not scrubbing
    if (!this.scrubbingAudio) {
      this.setAudioTimeByClickLocation(event);
    }
  }

  setAudioTimeByClickLocation(event: any) {
    try {
      const audioBarElem = event.target.closest('.audioplayer-bar');
      if (!audioBarElem) return;

      const boundingRect = audioBarElem.getBoundingClientRect();

      // Handle both touch and mouse events
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      if (typeof clientX !== 'number') return;

      // Ensure the click is within the bounds of the audio bar
      if (clientX < boundingRect.left || clientX > boundingRect.right) return;

      const clickX = clientX - boundingRect.left;
      const percentage = Math.max(
        0,
        Math.min(100, (clickX / boundingRect.width) * 100),
      );

      this.setTimeByPercentage(percentage);
    } catch (error) {
      console.error('Error in setAudioTimeByClickLocation:', error);
    }
  }

  onAudioBarStartScrubbing(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.scrubbingAudio = true;

    // If it's a touch event, immediately set the position
    if (event.touches) {
      this.setAudioTimeByClickLocation(event);
    }
  }

  onAudioBarStopScrubbing(event: any) {
    event.preventDefault();
    event.stopPropagation();
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

    setTimeout(() => {
      this.audio = new Howl({
        src: [audioUrl],
      });
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
