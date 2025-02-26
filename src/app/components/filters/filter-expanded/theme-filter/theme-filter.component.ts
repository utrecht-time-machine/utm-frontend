import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { FilterExpandedComponent } from '../filter-expanded.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';

@Component({
  selector: 'app-theme-filter',
  templateUrl: './theme-filter.component.html',
  styleUrls: ['./theme-filter.component.scss'],
})
export class ThemeFilterComponent extends FilterExpandedComponent {
  constructor(public themes: ThemeService, public filters: FilterService) {
    super();
  }

  get numSelectedThemesStr(): string {
    const numSelectedThemes: number = this.themes.selectedIds.value.length;
    if (numSelectedThemes === 0) {
      return '';
    }
    return ` (${numSelectedThemes.toString()})`;
  }

  onClose() {}

  protected readonly FilterType = FilterType;
}
