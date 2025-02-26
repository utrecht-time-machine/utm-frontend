import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FilterComponent } from '../filter.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';

@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimeFilterComponent
  extends FilterComponent
  implements AfterViewInit
{
  debouncedTimeout: any;

  constructor(public time: TimeService, public filters: FilterService) {
    super();
  }
  formatLabel(value: number): string {
    if (value < 0) {
      return `${-value} v. Chr.`;
    }
    return `${value}`;
  }

  onSliderInput($event: any) {
    const target = $event.target || $event.originalTarget;
    if (!target) {
      return;
    }
    const id = target.id;
    const value = target.value;

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

  protected readonly FilterType = FilterType;
}
