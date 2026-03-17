import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Howl } from 'howler';
import {
  AudioCoordinatorService,
  AudioPlayerRegistration,
} from 'src/app/services/audio-coordinator.service';
import { DebugLogService } from 'src/app/services/debug-log.service';
import { PlatformService } from 'src/app/services/platform.service';
import { SHOW_PULSE_ANIMATION_INSTEAD_OF_AUDIO_AUTOPLAY } from 'src/app/services/geofence/geofence.constants';

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
  isLoading = false;
  hasError = false;

  @HostBinding('class.pulse-animation') pulseAnimation = false;

  @Input() audioUrl: string | undefined;
  @Input() transcript?: string;

  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  private _registration: AudioPlayerRegistration | undefined;

  constructor(
    public platform: PlatformService,
    private logger: DebugLogService,
    private audioCoordinator: AudioCoordinatorService,
    private elementRef: ElementRef,
  ) {
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

  ngOnInit() {}

  ngOnDestroy() {
    this.audio?.stop();
    this.audio?.unload();
    if (this._registration) {
      this.audioCoordinator.unregisterPlayer(this._registration);
      this._registration = undefined;
    }
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
      const percentage = Math.max(0, Math.min(100, (clickX / boundingRect.width) * 100));

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

    this.isLoading = true;
    this.hasError = false;
    this.logger.log('AudioPlayer', 'load', { audioUrl });
    setTimeout(() => {
      this.audio = new Howl({
        src: [audioUrl],
        onload: () => {
          this.isLoading = false;
          this.hasError = false;
          this.logger.log('AudioPlayer', 'Howl loaded', { audioUrl });
          if (this._registration) {
            this.audioCoordinator.unregisterPlayer(this._registration);
          }
          this._registration = {
            elementRef: this.elementRef,
            play: () => {
              this.logger.log('AudioPlayer', 'autoplay triggered via coordinator');
              if (SHOW_PULSE_ANIMATION_INSTEAD_OF_AUDIO_AUTOPLAY) {
                this._startPulseAnimation();
              } else {
                this.audio?.play();
              }
            },
          };
          this.audioCoordinator.registerPlayer(this._registration);
        },
        onplay: () => {
          this.logger.log('AudioPlayer', 'playing');
          this._stopPulseAnimation();
        },
        onpause: () => {
          this.logger.log('AudioPlayer', 'paused');
        },
        onstop: () => {
          this.logger.log('AudioPlayer', 'stopped');
        },
        onloaderror: (_id: number, err: unknown) => {
          this.isLoading = false;
          this.hasError = true;
          this.logger.error('AudioPlayer', 'load error', err);
        },
      });
    });
  }

  togglePlayPause() {
    if (!this.audio || this.isLoading || this.hasError) {
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

  private _startPulseAnimation(): void {
    this.pulseAnimation = true;
    this.logger.log('AudioPlayer', 'pulse animation started');
  }

  private _stopPulseAnimation(): void {
    if (this.pulseAnimation) {
      this.pulseAnimation = false;
      this.logger.log('AudioPlayer', 'pulse animation stopped');
    }
  }
}
