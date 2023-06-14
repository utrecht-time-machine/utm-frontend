import { Component, ElementRef, ViewChild } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef;

  constructor(public utmRoutes: UtmRoutesService) {
    utmRoutes.selectedStopIdx.subscribe(() => {
      setTimeout(() => {
        if (this.audioElement) {
          this.audioElement.nativeElement.load();
        }
      });
    });
  }

  ngOnInit() {}
}
