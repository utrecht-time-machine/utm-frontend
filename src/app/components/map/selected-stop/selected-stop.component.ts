import { Component, ElementRef, ViewChild } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { AudioService } from '../../../services/audio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  scrubbingAudio = false;

  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  constructor(
    public utmRoutes: UtmRoutesService,
    public audio: AudioService,
    public router: Router
  ) {
    // utmRoutes.selectedStopIdx.subscribe(() => {
    //   this.audio.load(utmRoutes.selectedStop?.audio);
    // });
  }

  ngOnInit() {}

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

    this.audio.setTimeByPercentage(percentage);
  }

  onAudioBarStartScrubbing() {
    this.scrubbingAudio = true;
  }

  onAudioBarStopScrubbing() {
    this.scrubbingAudio = false;
  }
}
