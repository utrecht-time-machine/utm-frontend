import { Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-time-slider-button',
  templateUrl: './time-slider-button.component.html',
  styleUrls: ['./time-slider-button.component.scss'],
})
export class TimeSliderButtonComponent {
  constructor(public time: TimeService) {}

  get badgeText(): string {
    // if (this.time.showLocationsWithoutDate.value) {
    //   return '';
    // }
    return `${this.time.minYear.value} - ${this.time.maxYear.value}`;
  }
}
