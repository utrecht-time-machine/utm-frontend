import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PushNotificationService } from './push-notification.service';
import { UtmRoutesService } from '../utm-routes.service';
import { RouteStopData } from '../../models/route-stop-data';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationClickService {
  private sub: Subscription | undefined;

  constructor(private push: PushNotificationService, private utmRoutes: UtmRoutesService) {
    void this.init();
  }

  private async init(): Promise<void> {
    await this.push.ensureClickHandlerRegistered();

    if (this.sub) {
      return;
    }

    this.sub = this.push.click$.subscribe(({ notification }) => {
      this.handleClick(notification);
    });
  }

  private handleClick(notification: unknown): void {
    const data = this.extractNotificationData(notification);
    if (!data) {
      return;
    }

    if (this.handleRouteStopClick(data)) {
      return;
    }
  }

  private extractNotificationData(notification: unknown): RouteStopData | null {
    if (!notification || typeof notification !== 'object') {
      return null;
    }

    const notif = notification as Record<string, unknown>;
    return (notif['data'] as RouteStopData) ?? null;
  }

  private handleRouteStopClick(data: RouteStopData): boolean {
    const { routeId, stopIdx } = data;


    if (typeof routeId !== 'string') {
      return false;
    }

    const stopIdxNum = typeof stopIdx === 'number' ? stopIdx : undefined;

    void this.utmRoutes.navigateToRouteStop(routeId, stopIdxNum);
    return true;
  }
}
