import { Component, Input } from '@angular/core';
import { FilterLocation } from '../../../models/filter-location.enum';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent {
  @Input() location: FilterLocation = FilterLocation.Map;
  @Input() badgeText: string = '';
  @Input() icon: string = '';
  protected readonly FilterLocation = FilterLocation;
}
