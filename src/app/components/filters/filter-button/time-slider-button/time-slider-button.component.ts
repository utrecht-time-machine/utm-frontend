import { Component } from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { ThemeService } from '../../../../services/theme.service';
import { FilterButtonComponent } from '../filter-button.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';

@Component({
  selector: 'app-time-slider-button',
  templateUrl: './time-slider-button.component.html',
  styleUrls: ['./time-slider-button.component.scss'],
})
export class TimeSliderButtonComponent extends FilterButtonComponent {
  constructor(
    public time: TimeService,
    public themes: ThemeService,
    public filters: FilterService
  ) {
    super();
  }

  formatYear(year: number): string {
    if (year < 0) {
      return `${Math.abs(year)} v. Chr.`;
    }
    return year.toString();
  }

  get selectedTimeRange(): string {
    if (this.time.selectedDefaultRange()) {
      return '';
    }

    const minYear = this.formatYear(this.time.minYear.value);
    const maxYear = this.formatYear(this.time.maxYear.value);
    return `${minYear} - ${maxYear}`;
  }

  protected readonly FilterType = FilterType;
}
