import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { TimeService } from '../../../../services/time.service';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss'],
})
export class ThemeButtonComponent {
  constructor(public themes: ThemeService, public time: TimeService) {}

  get badgeText(): string {
    const numSelectedThemes: number = this.themes.selectedIds.value.length;
    if (numSelectedThemes === 0) {
      return '';
    }
    return numSelectedThemes.toString();
  }
}
