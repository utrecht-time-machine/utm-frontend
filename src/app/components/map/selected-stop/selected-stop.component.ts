import { Component, ElementRef, ViewChild } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  constructor(public utmRoutes: UtmRoutesService, public audio: AudioService) {
    utmRoutes.selectedStopIdx.subscribe(() => {
      this.audio.load(utmRoutes.selectedStop?.audio);
    });
  }

  ngOnInit() {}

  onAudioBarClicked(event: any) {
    if (!event.target) {
      return;
    }

    const audioBarElem = event.target;
    const boundingRect = audioBarElem.getBoundingClientRect();
    const clickX = event.clientX - boundingRect.left;
    const percentage = (clickX / boundingRect.width) * 100;

    this.audio.setTimeByPercentage(percentage);
  }
}
