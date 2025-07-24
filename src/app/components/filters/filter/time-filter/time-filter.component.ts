import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TimeService } from '../../../../services/time.service';
import { FilterComponent } from '../filter.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-time-filter',
  templateUrl: './time-filter.component.html',
  styleUrls: ['./time-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimeFilterComponent extends FilterComponent {
  showManualInputs = false;
  @ViewChild('slider') slider!: MatSlider;
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

  onSlideStart(): void {
    this.time.isSliding.next(true);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onSlideEnd(): void {
    this.time.isSliding.next(false);
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
    }, 100);
  }

  onMinYearChange(minYear: number) {
    this.time.minYear.next(minYear);
  }

  onMaxYearChange(maxYear: number) {
    this.time.maxYear.next(maxYear);
  }

  onManualMinYearInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value)) {
      const clampedValue = Math.max(
        this.time.DEFAULT_MIN_YEAR,
        Math.min(value, this.time.maxYear.value - 1)
      );
      this.onMinYearChange(clampedValue);

      if (clampedValue !== value) {
        input.value = clampedValue.toString();
      }
    }
  }

  onManualMaxYearInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (!isNaN(value)) {
      const clampedValue = Math.min(
        this.time.DEFAULT_MAX_YEAR,
        Math.max(value, this.time.minYear.value + 1)
      );
      this.onMaxYearChange(clampedValue);

      if (clampedValue !== value) {
        input.value = clampedValue.toString();
      }
    }
  }

  toggleManualInputs(): void {
    this.showManualInputs = !this.showManualInputs;
  }

  protected readonly FilterType = FilterType;
}
