import { Component } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { ThemeService } from '../../services/theme.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor() {}
}
