import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class CordovaService {
  private readyPromise: Promise<boolean>;
  private cordovaRef: any | undefined;

  constructor(private platform: PlatformService) {
    if (!this.platform.isBrowser()) {
      this.readyPromise = Promise.resolve(false);
      return;
    }

    const w = window as any;
    if (w?.cordova) {
      this.cordovaRef = w.cordova;
      this.readyPromise = Promise.resolve(true);
      return;
    }

    this.readyPromise = new Promise<boolean>((resolve) => {
      document.addEventListener(
        'deviceready',
        () => {
          this.cordovaRef = (window as any)?.cordova;
          resolve(Boolean(this.cordovaRef));
        },
        { once: true }
      );
    });
  }

  isAvailable(): boolean {
    return Boolean(this.cordovaRef);
  }

  async ready(timeoutMs = 2000): Promise<boolean> {
    if (!this.platform.isBrowser()) {
      return false;
    }

    if (this.cordovaRef) {
      return true;
    }

    return await Promise.race([
      this.readyPromise,
      new Promise<boolean>((resolve) =>
        window.setTimeout(() => resolve(false), timeoutMs)
      ),
    ]);
  }

  getCordova(): any | undefined {
    return this.cordovaRef;
  }
}
