import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CordovaService } from '../cordova.service';

export type LocalNotificationOptions = {
  id: number;
  title?: string;
  text?: string;
  data?: any;
};

export type LocalNotificationClickEvent = {
  notification: any;
};

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private readonly clickSubject = new Subject<LocalNotificationClickEvent>();
  public readonly click$ = this.clickSubject.asObservable();

  private clickHandlerRegistered = false;

  constructor(private cordova: CordovaService) {}

  async ensureClickHandlerRegistered(timeoutMs = 2000): Promise<void> {
    if (this.clickHandlerRegistered) {
      return;
    }

    const ready = await this.cordova.ready(timeoutMs);
    if (!ready) {
      return;
    }

    const cordovaRef = this.cordova.getCordova();
    const localNotification = cordovaRef?.plugins?.notification?.local;
    if (!localNotification?.on) {
      return;
    }

    this.clickHandlerRegistered = true;
    localNotification.on('click', (notification: any) => {
      this.clickSubject.next({ notification });
    });
  }

  async scheduleLocalNotification(
    options: LocalNotificationOptions,
    timeoutMs = 2000,
  ): Promise<boolean> {
    console.log('[PushNotificationService] scheduleLocalNotification called', {
      options,
      timeoutMs,
    });

    const ready = await this.cordova.ready(timeoutMs);
    console.log('[PushNotificationService] cordova.ready result', { ready });
    if (!ready) {
      console.warn(
        '[PushNotificationService] Cordova not ready / not available; not scheduling notification',
      );
      return false;
    }

    const cordovaRef = this.cordova.getCordova();
    const localNotification = cordovaRef?.plugins?.notification?.local;
    if (!localNotification?.schedule) {
      console.warn(
        '[PushNotificationService] cordova.plugins.notification.local.schedule not available',
        { cordovaRef },
      );
      return false;
    }

    console.log('[PushNotificationService] Scheduling local notification', options);
    localNotification.schedule(options);
    console.log('[PushNotificationService] scheduleLocalNotification done');

    void this.ensureClickHandlerRegistered(timeoutMs);
    return true;
  }
}
