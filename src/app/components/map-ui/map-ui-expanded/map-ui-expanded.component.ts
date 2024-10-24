import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterLocation } from '../../../models/filter-location.enum';

@Component({
  selector: 'app-map-ui-expanded',
  templateUrl: './map-ui-expanded.component.html',
  styleUrls: ['./map-ui-expanded.component.scss'],
})
export class MapUiExpandedComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Output() close = new EventEmitter();
  @Input() overflowY: string = 'scroll';
  @Input() maxHeight: string = '10rem';
  @Input() location: FilterLocation = FilterLocation.Map;
}
