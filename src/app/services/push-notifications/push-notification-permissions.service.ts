import { Injectable } from '@angular/core';

import { CordovaService } from '../cordova.service';
import { DebugLogService } from '../debug-log.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationPermissionsService {
  constructor(private cordova: CordovaService, private logger: DebugLogService) {}

  private async getLocalNotification(timeoutMs = 2000): Promise<any | undefined> {
    const ready = await this.cordova.ready(timeoutMs);
    if (!ready) {
      return undefined;
    }

    const cordovaRef = this.cordova.getCordova();
    return cordovaRef?.plugins?.notification?.local;
  }

  async hasPermission(timeoutMs = 2000): Promise<boolean> {
    const localNotification = await this.getLocalNotification(timeoutMs);
    if (!localNotification) {
      return false;
    }

    if (typeof localNotification.hasPermission !== 'function') {
      this.logger.warn(
        'PushNotificationPermissionsService',
        'cordova.plugins.notification.local.hasPermission not available',
      );
      return true;
    }

    return await new Promise<boolean>(resolve => {
      try {
        localNotification.hasPermission((granted: boolean) => resolve(!!granted));
      } catch (e) {
        this.logger.warn('PushNotificationPermissionsService', 'hasPermission failed', e);
        resolve(false);
      }
    });
  }

  async requestPermission(timeoutMs = 2000): Promise<boolean> {
    const localNotification = await this.getLocalNotification(timeoutMs);
    if (!localNotification) {
      return false;
    }

    if (typeof localNotification.requestPermission !== 'function') {
      this.logger.warn(
        'PushNotificationPermissionsService',
        'cordova.plugins.notification.local.requestPermission not available',
      );
      return true;
    }

    return await new Promise<boolean>(resolve => {
      try {
        localNotification.requestPermission((granted: boolean) => resolve(!!granted));
      } catch (e) {
        this.logger.warn('PushNotificationPermissionsService', 'requestPermission failed', e);
        resolve(false);
      }
    });
  }

  async ensurePermission(timeoutMs = 2000): Promise<boolean> {
    const has = await this.hasPermission(timeoutMs);
    if (has) {
      return true;
    }

    return await this.requestPermission(timeoutMs);
  }
}
