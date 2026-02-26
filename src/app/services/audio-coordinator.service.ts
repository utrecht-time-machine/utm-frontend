import { ElementRef, Injectable } from '@angular/core';
import { DebugLogService } from './debug-log.service';

export interface AudioPlayerRegistration {
  elementRef: ElementRef;
  play: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class AudioCoordinatorService {
  private _pendingAutoPlay = false;
  private _registeredPlayers: AudioPlayerRegistration[] = [];
  private _autoPlayTimeout: any;

  constructor(private logger: DebugLogService) {}

  requestAutoPlay() {
    this._pendingAutoPlay = true;
    this.logger.log('AudioCoordinatorService', 'autoplay requested');
    if (this._autoPlayTimeout) {
      clearTimeout(this._autoPlayTimeout);
    }
  }

  registerPlayer(registration: AudioPlayerRegistration) {
    this._registeredPlayers.push(registration);
    this.logger.log('AudioCoordinatorService', 'player registered', {
      total: this._registeredPlayers.length,
      pendingAutoPlay: this._pendingAutoPlay,
    });

    if (this._pendingAutoPlay) {
      if (this._autoPlayTimeout) {
        this.logger.log('AudioCoordinatorService', 'clearing existing autoplay timeout');
        clearTimeout(this._autoPlayTimeout);
      }
      // Wait 1000ms for other players to register before autoplaying the top one in the DOM
      this.logger.log('AudioCoordinatorService', 'scheduling autoplay attempt in 1000ms');
      this._autoPlayTimeout = setTimeout(() => {
        this._tryAutoPlay();
      }, 1000);
    }
  }

  unregisterPlayer(registration: AudioPlayerRegistration) {
    this._registeredPlayers = this._registeredPlayers.filter(r => r !== registration);
    this.logger.log('AudioCoordinatorService', 'player unregistered', {
      total: this._registeredPlayers.length,
    });
  }

  private _clearAutoPlayTimeout() {
    if (this._autoPlayTimeout) {
      clearTimeout(this._autoPlayTimeout);
      this._autoPlayTimeout = undefined;
    }
  }

  private _tryAutoPlay() {
    if (!this._pendingAutoPlay || this._registeredPlayers.length === 0) {
      this.logger.log(
        'AudioCoordinatorService',
        'no autoplay needed (pendingAutoPlay: ' +
          this._pendingAutoPlay +
          ', registeredPlayers: ' +
          this._registeredPlayers.length +
          ')',
      );
      return;
    }

    const topmost = this._getTopmostPlayer();
    if (!topmost) {
      this.logger.warn(
        'AudioCoordinatorService',
        'no topmost player found despite having registered players',
        {
          registeredCount: this._registeredPlayers.length,
        },
      );
      return;
    }

    this._pendingAutoPlay = false;
    this._clearAutoPlayTimeout();
    this.logger.log('AudioCoordinatorService', 'attempting to auto-play topmost player');

    try {
      topmost.play();
      this.logger.log('AudioCoordinatorService', 'auto-play initiated successfully');
    } catch (error) {
      this.logger.error('AudioCoordinatorService', 'auto-play failed', error);
    }
  }

  private _getTopmostPlayer(): AudioPlayerRegistration | undefined {
    if (this._registeredPlayers.length === 0) {
      return undefined;
    }

    return this._registeredPlayers.reduce((topmost, current) => {
      const topmostEl: HTMLElement = topmost.elementRef.nativeElement;
      const currentEl: HTMLElement = current.elementRef.nativeElement;
      const position = topmostEl.compareDocumentPosition(currentEl);
      const currentIsBeforeTopmost = position & Node.DOCUMENT_POSITION_PRECEDING;
      return currentIsBeforeTopmost ? current : topmost;
    });
  }
}
