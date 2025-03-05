import { Component, type OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { TimeService } from 'src/app/services/time.service';

@Component({
  selector: 'app-active-filters-badge',
  templateUrl: './active-filters-badge.component.html',
  styleUrls: ['./active-filters-badge.component.scss'],
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
      return `1 filter actief`;
    }

    return `${this.activeFiltersCount()} filters actief`;
  }
}
