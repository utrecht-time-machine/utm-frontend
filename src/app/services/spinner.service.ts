import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  loadingLocation = false;
  loadingRoute = false;
  loadingRouteStopLocation = false;
  loadingRouteStopStories = false;
  loadingLocations = false;
  loadingStaticPage = false;
  loadingHome = false;

  public get show() {
    return (
      this.loadingLocation ||
      this.loadingRoute ||
      this.loadingRouteStopLocation ||
      this.loadingRouteStopStories ||
      this.loadingLocations ||
      this.loadingStaticPage ||
      this.loadingHome
    );
  }
  constructor() {}
}
