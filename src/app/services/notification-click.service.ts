import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PushNotificationService } from './push-notification.service';
import { UtmRoutesService } from './utm-routes.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationClickService {
  private sub: Subscription | undefined;

  constructor(
    private push: PushNotificationService,
    private utmRoutes: UtmRoutesService
  ) {
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

  private handleClick(notification: any): void {
    const data = notification?.data ?? notification?.extras ?? notification;
    if (!data) {
      return;
    }

    if (this.handleRouteStopClick(data)) {
      return;
    }
  }

  private handleRouteStopClick(data: any): boolean {
    const routeId = data?.routeId;
    const stopIdx = data?.stopIdx;

    if (typeof routeId !== 'string') {
      return false;
    }

    const stopIdxNum =
      typeof stopIdx === 'number'
        ? stopIdx
        : typeof stopIdx === 'string'
          ? Number(stopIdx)
          : undefined;

    void this.utmRoutes.navigateToRouteStop(routeId, stopIdxNum);
    return true;
  }
}
