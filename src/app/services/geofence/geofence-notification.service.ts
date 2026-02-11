import { Injectable } from '@angular/core';

import type { GeofenceEvent } from 'cordova-background-geolocation-lt';

import { GeofenceIdentifierService } from './geofence-identifier.service';
import { PushNotificationService } from '../push-notifications/push-notification.service';
import { RouteStopData } from '../../models/route-stop-data';

@Injectable({
  providedIn: 'root',
})
export class GeofenceNotificationService {
  constructor(
    private push: PushNotificationService,
    private identifier: GeofenceIdentifierService,
  ) {}

  async handleGeofenceEvent(
    event: GeofenceEvent,
    opts: {
      routeNotificationsEnabled: boolean;
      getDataFromIdentifier: (identifier: string | undefined) => RouteStopData | undefined;
    },
  ): Promise<void> {
    const identifier = event?.identifier;
    const action = (event as any)?.action;

    if (action !== 'ENTER') {
      return;
    }

    if (!opts.routeNotificationsEnabled) {
      return;
    }

    const meta = opts.getDataFromIdentifier(identifier);

    const title = meta?.routeTitle || 'Utrecht Time Machine';
    const stopNum = meta?.stopIdx !== undefined ? meta.stopIdx + 1 : undefined;
    const stopPart = stopNum ? `Routepunt ${stopNum}` : 'Routepunt';
    const stopTitlePart = meta?.stopTitle ? ` (${meta.stopTitle})` : '';
    const text = `Je bent bij ${stopPart}${stopTitlePart} aangekomen. Tik om meer te lezen.`;

    const baseId: number = this.identifier.hashToInt(identifier ?? 'unknown');
    const notificationId: number = (baseId % 1000000) * 1000 + (Date.now() % 1000);

    const ok: boolean = await this.push.scheduleLocalNotification({
      id: notificationId,
      title,
      text,
      data: {
        routeId: meta?.routeId,
        stopIdx: meta?.stopIdx,
      },
    });

    if (!ok) {
      console.warn('[GeofenceNotificationService] scheduleLocalNotification failed', {
        identifier,
        notificationId,
      });
    }
  }
}
