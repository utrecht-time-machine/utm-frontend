import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { UtmRoute } from '../../../models/utm-route';
import { RouteNotificationsSettingsService } from '../../../services/route-notifications-settings.service';
import { DebugLogService } from '../../../services/debug-log.service';

@Component({
  selector: 'app-route-steps',
  templateUrl: './route-steps.component.html',
  styleUrls: ['./route-steps.component.scss'],
  standalone: false,
})
export class RouteStepsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navMenu', { read: ElementRef }) navMenuRef?: ElementRef<HTMLElement>;

  private stopIdxSub?: Subscription;

  constructor(
    public utmRoutes: UtmRoutesService,
    public routeNotifications: RouteNotificationsSettingsService,
    private logger: DebugLogService,
  ) {}

  ngAfterViewInit(): void {
    this.stopIdxSub = this.utmRoutes.selectedStopIdx.subscribe(stopIdx => {
      if (stopIdx !== undefined && stopIdx !== null) {
        setTimeout(() => this.scrollToStep(stopIdx), 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopIdxSub?.unsubscribe();
  }

  private scrollToStep(stopIdx: number): void {
    const navMenu = this.navMenuRef?.nativeElement;
    if (!navMenu) {
      this.logger.warn('RouteStepsComponent', 'scrollToStep: navMenuRef not found');
      return;
    }

    const ul = navMenu.querySelector('ul');
    if (!ul) {
      this.logger.warn('RouteStepsComponent', 'scrollToStep: ul not found');
      return;
    }

    const targetLi = ul.children[stopIdx + 1] as HTMLElement;
    if (!targetLi) {
      this.logger.warn(
        'RouteStepsComponent',
        `scrollToStep: targetLi not found for index ${stopIdx}`,
      );
      return;
    }

    const containerWidth = navMenu.offsetWidth;
    const targetLeft = targetLi.offsetLeft;
    const targetWidth = targetLi.offsetWidth;
    const targetCenter = targetLeft + targetWidth / 2;
    const scrollPosition = targetCenter - containerWidth / 2;

    this.logger.log('RouteStepsComponent', `Scrolling to step ${stopIdx}`, {
      stopIdx,
      targetLeft,
      targetCenter,
      scrollPosition,
      containerWidth,
    });

    navMenu.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }

  public get selectedRoute(): UtmRoute | undefined {
    return this.utmRoutes.selected.getValue();
  }

  public get routeDurationStr(): string {
    return this.selectedRoute?.duration_minutes
      ? `(${this.selectedRoute.duration_minutes} min)`
      : '';
  }

  public get routeDistanceStr(): string {
    return this.selectedRoute?.distance ? `${this.selectedRoute.distance}` : '';
  }

  public get routeTypeStr(): string {
    if (this.selectedRoute?.type == 'Fietsroute') {
      return 'cycling';
    }
    return 'walking';
  }
}
