import { Injectable } from '@angular/core';

import type { GeofenceEvent } from 'cordova-background-geolocation-lt';

import { DebugLogService } from '../debug-log.service';
import { GeofenceIdentifierService } from './geofence-identifier.service';
import { PushNotificationService } from '../push-notifications/push-notification.service';
import { RouteStopData } from '../../models/route-stop-data';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class GeofenceNotificationService {
  constructor(
    private push: PushNotificationService,
    private identifier: GeofenceIdentifierService,
    private logger: DebugLogService,
    private translate: TranslateService,
  ) {}

  async handleGeofenceEvent(
    event: GeofenceEvent,
    opts: {
      routeNotificationsEnabled: boolean;
      getDataFromIdentifier: (identifier: string | undefined) => RouteStopData | undefined;
    },
  ): Promise<void> {
    const identifier = event?.identifier;
    const action = event?.action;

    if (action !== 'ENTER') {
      return;
    }

    if (!opts.routeNotificationsEnabled) {
      return;
    }

    const meta = opts.getDataFromIdentifier(identifier);

    const title = meta?.routeTitle || this.translate.instant('appTitle');
    const stopNum = meta?.stopIdx !== undefined ? meta.stopIdx + 1 : undefined;
    const stopPart = stopNum
      ? this.translate.instant('routePoint', { number: stopNum })
      : this.translate.instant('routePointDefault');
    const stopTitlePart = meta?.stopTitle ? ` (${meta.stopTitle})` : '';
    const text = this.translate.instant('nearRoutePoint', {
      stopPart: `${stopPart}${stopTitlePart}`,
    });

    const baseId: number = this.identifier.hashToInt(identifier ?? 'unknown');
    const notificationId: number = (baseId % 1000000) * 1000 + (Date.now() % 1000);

    const ok: boolean = await this.push.scheduleLocalNotification({
      id: notificationId,
      title,
      text,
      trigger: { at: new Date(Date.now() + 1000) },
      data: {
        routeId: meta?.routeId,
        stopIdx: meta?.stopIdx,
      },
    });

    if (!ok) {
      this.logger.warn('GeofenceNotificationService', 'scheduleLocalNotification failed', {
        identifier,
        notificationId,
      });
    }
  }
}
