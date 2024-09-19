import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  DEFAULT_MIN_YEAR = 1000;
  DEFAULT_MAX_YEAR = new Date().getFullYear();

  numTimesMinYearUpdated = 0;
  minYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MIN_YEAR
  );
  numTimesMaxYearUpdated = 0;
  maxYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MAX_YEAR
  );
  numTimesShowLocationsWithoutDateUpdated = 0;
  showLocationsWithoutDate: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  showingSelectionScreen = false;

  constructor() {
    this.minYear.subscribe(() => {
      this.numTimesMinYearUpdated++;
    });

    this.maxYear.subscribe(() => {
      this.numTimesMaxYearUpdated++;
    });

    this.showLocationsWithoutDate.subscribe(() => {
      this.numTimesShowLocationsWithoutDateUpdated++;
    });
  }

  isInSelectedRange(minDates: string[], maxDates: string[]) {
    const minYears = minDates.map((minDate) => {
      return new Date(minDate).getFullYear();
    });
    const maxYears = maxDates.map((maxDate) => {
      return new Date(maxDate).getFullYear();
    });
    let minYear = Math.min(...minYears);
    let maxYear = Math.max(...maxYears);

    const hasMinDate = minDates && minDates.length > 0;
    const hasMaxDate = maxDates && maxDates.length > 0;

    let shouldShow = false;
    if (hasMinDate && hasMaxDate) {
      if (minYear <= this.maxYear.value && maxYear >= this.minYear.value) {
        shouldShow = true;
      }
    } else if (!hasMinDate && !hasMaxDate) {
      return this.showLocationsWithoutDate.value;
    } else {
      let year: number = hasMinDate && !hasMaxDate ? minYear : maxYear;

      if (this.minYear.value <= year && this.maxYear.value >= year) {
        shouldShow = true;
      }
    }

    return shouldShow;
  }
}
