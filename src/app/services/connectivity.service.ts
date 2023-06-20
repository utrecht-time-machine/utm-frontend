import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  isOffline: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // TODO: Replace with alternative method (that works with Cordova as well)
    // window.addEventListener('online', this.onOnline.bind(this));
    // window.addEventListener('offline', this.onOffline.bind(this));
  }

  onOnline(e: any) {
    this.isOffline.next(false);
  }

  onOffline(e: any) {
    this.isOffline.next(true);
  }
}
