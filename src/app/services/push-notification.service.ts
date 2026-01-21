import { Injectable } from '@angular/core';
import { CordovaService } from './cordova.service';

export type LocalNotificationOptions = {
  id: number;
  title?: string;
  text?: string;
};

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private cordova: CordovaService) {}

  async scheduleLocalNotification(
    options: LocalNotificationOptions,
    timeoutMs = 2000
  ): Promise<boolean> {
    const ready = await this.cordova.ready(timeoutMs);
    if (!ready) return false;

    const cordovaRef = this.cordova.getCordova();
    const localNotification = cordovaRef?.plugins?.notification?.local;
    if (!localNotification?.schedule) return false;

    localNotification.schedule(options);
    return true;
  }
}
