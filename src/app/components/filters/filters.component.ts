import { Component } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { FilterService } from '../../services/filter.service';
import { map, combineLatest, lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor(public time: TimeService, public filters: FilterService) {}

  async onClick() {
    const isShowing = await lastValueFrom(this.filters.isShowing.pipe(take(1)));

    if (!isShowing) {
      this.filters.show();
    }
  }

  getStyles$ = combineLatest([
    this.time.isSliding,
    this.filters.isShowing,
  ]).pipe(
    map(([isSliding, isShowingFilters]) => ({
      background: `rgba(255, 255, 255, ${isSliding ? 0.6 : 0.85})`,
      'backdrop-filter': `blur(${isSliding ? 0 : 16}px)`,
      width: isShowingFilters ? 'calc(100% - 1.5rem)' : 'auto',
      cursor: isShowingFilters ? 'default' : 'pointer',
      height: isShowingFilters ? 'calc(100% - 6rem - 1.5rem)' : 'auto',
    }))
  );
}
