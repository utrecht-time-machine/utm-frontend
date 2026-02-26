import { Injectable } from '@angular/core';

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

  async handleProximityTrigger(meta: RouteStopData): Promise<void> {
    const title = meta?.routeTitle || this.translate.instant('appTitle');
    const stopNum = meta?.stopIdx !== undefined ? meta.stopIdx + 1 : undefined;
    const stopPart = stopNum
      ? this.translate.instant('routePoint', { number: stopNum })
      : this.translate.instant('routePointDefault');
    const stopTitlePart = meta?.stopTitle ? ` (${meta.stopTitle})` : '';
    const text = this.translate.instant('nearRoutePoint', {
      stopPart: `${stopPart}${stopTitlePart}`,
    });

    const identifierStr = `route:${meta.routeId ?? 'unknown'}:stop:${meta.stopIdx ?? 0}`;
    const baseId: number = this.identifier.hashToInt(identifierStr);
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
        identifierStr,
        notificationId,
      });
    }
  }
}
