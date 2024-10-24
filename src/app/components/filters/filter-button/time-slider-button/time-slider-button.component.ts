import { Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { ThemeService } from '../../../../services/theme.service';
import { FilterButtonComponent } from '../filter-button.component';

@Component({
  selector: 'app-time-slider-button',
  templateUrl: './time-slider-button.component.html',
  styleUrls: ['./time-slider-button.component.scss'],
})
export class TimeSliderButtonComponent extends FilterButtonComponent {
  constructor(public time: TimeService, public themes: ThemeService) {
    super();
  }

  get selectedTimeRange(): string {
    // if (this.time.showLocationsWithoutDate.value) {
    //   return '';
    // }
    if (this.time.selectedDefaultRange()) {
      return '';
    }

    return `${this.time.minYear.value} - ${this.time.maxYear.value}`;
  }
}
