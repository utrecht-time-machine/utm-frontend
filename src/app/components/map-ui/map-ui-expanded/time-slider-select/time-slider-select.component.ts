import { Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-time-slider-select',
  templateUrl: './time-slider-select.component.html',
  styleUrls: ['./time-slider-select.component.scss'],
})
export class TimeSliderSelectComponent {
  constructor(public time: TimeService) {}
}
