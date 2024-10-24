import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { FilterExpandedComponent } from '../filter-expanded.component';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrls: ['./theme-select.component.scss'],
})
export class ThemeSelectComponent extends FilterExpandedComponent {
  constructor(public themes: ThemeService) {
    super();
  }

  onClose() {
    alert('FDJSLK');
  }
}
