import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  loadingLocation = false;
  loadingRoute = false;
  loadingLocations = false;

  public get show() {
    return this.loadingLocation || this.loadingRoute || this.loadingLocations;
  }
  constructor() {}
}
