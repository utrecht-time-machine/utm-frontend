import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  DEFAULT_MIN_YEAR = 0;
  DEFAULT_MAX_YEAR = new Date().getFullYear();

  minYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MIN_YEAR,
  );
  maxYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MAX_YEAR,
  );
  isSliding = new BehaviorSubject<boolean>(false);

  constructor() {}

  isActive(): boolean {
    return !this.isSetToDefaultRange();
  }

  isSetToDefaultRange(): boolean {
    return (
      this.minYear.value <= this.DEFAULT_MIN_YEAR &&
      this.maxYear.value >= this.DEFAULT_MAX_YEAR
    );
  }

  setToDefaultRange() {
    this.minYear.next(this.DEFAULT_MIN_YEAR);
    this.maxYear.next(this.DEFAULT_MAX_YEAR);
  }

  isInSelectedRange(minDates: string[], maxDates: string[]) {
    // If no dates are provided, show only if slider is at default range
    const hasMinDate =
      minDates?.length > 0 && minDates.some((date) => date !== '');
    const hasMaxDate =
      maxDates?.length > 0 && maxDates.some((date) => date !== '');

    if (!hasMinDate && !hasMaxDate) {
      return this.isSetToDefaultRange();
    }

    // Get the min and max years from the dates
    const minYears = minDates
      .filter((date) => date !== '')
      .map((date) => new Date(date).getFullYear());
    const maxYears = maxDates
      .filter((date) => date !== '')
      .map((date) => new Date(date).getFullYear());

    const locationMinYear =
      minYears.length > 0 ? Math.min(...minYears) : undefined;
    const locationMaxYear =
      maxYears.length > 0 ? Math.max(...maxYears) : undefined;

    // If we have both min and max dates
    if (locationMinYear !== undefined && locationMaxYear !== undefined) {
      return (
        locationMinYear <= this.maxYear.value &&
        locationMaxYear >= this.minYear.value
      );
    }

    // If we have only one date
    const singleYear = locationMinYear ?? locationMaxYear;
    return (
      singleYear !== undefined &&
      this.minYear.value <= singleYear &&
      this.maxYear.value >= singleYear
    );
  }
}
