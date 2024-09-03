import { Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-time-slider-button',
  templateUrl: './time-slider-button.component.html',
  styleUrls: ['./time-slider-button.component.scss'],
})
export class TimeSliderButtonComponent {
  constructor(public time: TimeService) {}
}
