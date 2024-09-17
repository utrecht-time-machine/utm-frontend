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

  showingSelectionScreen = true;

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

  isInSelectedRange(minDate: string, maxDate: string) {
    let minYear = new Date(minDate).getFullYear();
    let maxYear = new Date(maxDate).getFullYear();

    let shouldShow = false;
    if (minDate && maxDate) {
      if (minYear <= this.maxYear.value && maxYear >= this.minYear.value) {
        shouldShow = true;
      }
    } else if (!minDate && !maxDate) {
      return this.showLocationsWithoutDate.value;
    } else {
      let year: number = minDate && !maxDate ? minYear : maxYear;

      if (this.minYear.value <= year && this.maxYear.value >= year) {
        shouldShow = true;
      }
    }

    return shouldShow;
  }
}
