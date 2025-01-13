import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { FilterExpandedComponent } from '../filter-expanded.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrls: ['./theme-select.component.scss'],
})
export class ThemeSelectComponent extends FilterExpandedComponent {
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

  onSearchChange(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    this.themes.filterThemes(searchText);
  }

  protected readonly FilterType = FilterType;
}
