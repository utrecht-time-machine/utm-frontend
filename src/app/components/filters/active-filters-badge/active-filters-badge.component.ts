import { Component, type OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-active-filters-badge',
  templateUrl: './active-filters-badge.component.html',
  styleUrls: ['./active-filters-badge.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(50%, -30%)' }),
        animate(
          '200ms 300ms ease-out',
          style({ opacity: 1, transform: 'translate(50%, -50%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translate(50%, -70%)' })
        ),
      ]),
    ]),
  ],
})
export class ActiveFiltersBadgeComponent implements OnInit {
  constructor(public theme: ThemeService, public time: TimeService) {}

  ngOnInit(): void {}

  activeFiltersCount(): number {
    return [this.time.isActive(), this.theme.isActive()].filter(
      (active) => active
    ).length;
  }

  badgeText(): string {
    if (this.activeFiltersCount() === 1) {
      return `1 filter`;
    }

    return `${this.activeFiltersCount()} filters`;
  }
}
