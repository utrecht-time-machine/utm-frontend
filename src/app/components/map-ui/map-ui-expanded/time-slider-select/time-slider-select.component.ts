import { AfterViewInit, Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-time-slider-select',
  templateUrl: './time-slider-select.component.html',
  styleUrls: ['./time-slider-select.component.scss'],
})
export class TimeSliderSelectComponent implements AfterViewInit {
  constructor(public time: TimeService) {}

  formatLabel(value: number): string {
    return `${value}`;
  }

  onSliderInput($event: any) {}

  ngAfterViewInit(): void {}

  onMinYearChange(minYear: number) {
    this.time.minYear.next(minYear);
  }

  onMaxYearChange(maxYear: number) {
    this.time.maxYear.next(maxYear);
  }

  onToggleShowLocationsWithoutDate($event: MatCheckboxChange) {
    this.time.showLocationsWithoutDate.next($event.checked);
  }
}
