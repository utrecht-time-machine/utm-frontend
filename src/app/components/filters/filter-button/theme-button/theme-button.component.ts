import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { TimeService } from '../../../../services/time.service';
import { FilterButtonComponent } from '../filter-button.component';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss'],
})
export class ThemeButtonComponent extends FilterButtonComponent {
  constructor(public themes: ThemeService, public time: TimeService) {
    super();
  }

  get numSelectedThemes(): string {
    const numSelectedThemes: number = this.themes.selectedIds.value.length;
    if (numSelectedThemes === 0) {
      return '';
    }
    return numSelectedThemes.toString();
  }
}
