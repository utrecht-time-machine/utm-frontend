import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  DEFAULT_MIN_YEAR = 1600;
  DEFAULT_MAX_YEAR = new Date().getFullYear();

  minYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MIN_YEAR
  );
  maxYear: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_MAX_YEAR
  );

  showingSelectionScreen = true;

  constructor() {}
}
