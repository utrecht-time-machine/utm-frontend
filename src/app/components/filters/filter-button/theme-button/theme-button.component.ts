import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { TimeService } from '../../../../services/time.service';
import { FilterButtonComponent } from '../filter-button.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss'],
})
export class ThemeButtonComponent extends FilterButtonComponent {
  constructor(
    public themes: ThemeService,
    public time: TimeService,
    public filters: FilterService
  ) {
    super();
  }

  get numSelectedThemes(): string {
    const numSelectedThemes: number = this.themes.selectedIds.value.length;
    if (numSelectedThemes === 0) {
      return '';
    }
    return numSelectedThemes.toString();
  }

  protected readonly FilterType = FilterType;
}
