import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterLocation } from '../../../models/filter-location.enum';

@Component({
  selector: 'app-filter-expanded',
  templateUrl: './filter-expanded.component.html',
  styleUrls: ['./filter-expanded.component.scss'],
})
export class FilterExpandedComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Output() close = new EventEmitter();
  @Input() overflowY: string = 'scroll';
  @Input() maxHeight: string = '10rem';
  @Input() location: FilterLocation = FilterLocation.Map;
  protected readonly FilterLocation = FilterLocation;
}
