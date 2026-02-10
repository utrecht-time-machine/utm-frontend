import { Component } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { FilterService } from '../../services/filter.service';
import { map, combineLatest, lastValueFrom, take } from 'rxjs';
import { RoutingService } from 'src/app/services/routing.service';
import { SelectedView } from 'src/app/models/selected-view';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(
        'false',
        style({
          width: 0,
          height: 0,
          opacity: 0,
          overflow: 'hidden',
          visibility: 'hidden',
          pointerEvents: 'none',
        }),
      ),
      state(
        'true',
        style({
          width: '*',
          height: '*',
          opacity: 1,
          overflow: 'hidden',
          visibility: 'visible',
          pointerEvents: 'auto',
        }),
      ),
      transition('false <=> true', [animate('400ms ease-in-out')]),
    ]),
  ],
  standalone: false,
})
export class FiltersComponent {
  constructor(
    public time: TimeService,
    public filters: FilterService,
    public routing: RoutingService,
  ) {}

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
      background: `rgba(255, 255, 255, 0.85)`,
      'backdrop-filter': `blur(16px)`,
      // background: `rgba(255, 255, 255, ${isSliding ? 0.6 : 0.85})`,
      // 'backdrop-filter': `blur(${isSliding ? 0 : 16}px)`,
      width: isShowingFilters ? 'calc(100% - 1.5rem)' : 'auto',
      cursor: isShowingFilters ? 'default' : 'pointer',
    })),
  );

  protected SelectedView = SelectedView;
}
