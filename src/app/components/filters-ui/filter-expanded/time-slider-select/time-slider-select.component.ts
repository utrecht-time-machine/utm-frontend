import { AfterViewInit, Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FilterExpandedComponent } from '../filter-expanded.component';
import { FilterLocation } from '../../../../models/filter-location.enum';

@Component({
  selector: 'app-time-slider-select',
  templateUrl: './time-slider-select.component.html',
  styleUrls: ['./time-slider-select.component.scss'],
})
export class TimeSliderSelectComponent
  extends FilterExpandedComponent
  implements AfterViewInit
{
  debouncedTimeout: any;

  constructor(public time: TimeService) {
    super();
  }
  formatLabel(value: number): string {
    return `${value}`;
  }

  onSliderInput($event: any) {
    if (!$event.originalTarget) {
      return;
    }
    const id = $event.originalTarget.id;
    const value = $event.originalTarget.value;

    clearTimeout(this.debouncedTimeout);
    this.debouncedTimeout = setTimeout(() => {
      if (id === 'max-year-input') {
        this.onMaxYearChange(value);
      } else if (id === 'min-year-input') {
        this.onMinYearChange(value);
      } else {
        console.warn('Unknown slider input', id, value);
      }
    }, 200);
  }

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

  protected readonly FilterLocation = FilterLocation;
}
