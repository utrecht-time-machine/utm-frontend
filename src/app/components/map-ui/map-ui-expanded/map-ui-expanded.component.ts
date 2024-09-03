import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-map-ui-expanded',
  templateUrl: './map-ui-expanded.component.html',
  styleUrls: ['./map-ui-expanded.component.scss'],
})
export class MapUiExpandedComponent {
  @Input() title: string = '';
  @Output() close = new EventEmitter();
}
