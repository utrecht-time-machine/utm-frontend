import { Component, Input } from '@angular/core';
import { FilterLocation } from '../../models/filter-location.enum';
import { TimeService } from '../../services/time.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() location: FilterLocation = FilterLocation.Map;

  constructor(public time: TimeService, public themes: ThemeService) {}

  protected readonly FilterLocation = FilterLocation;
}
