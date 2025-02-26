import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-expanded',
  templateUrl: './filter-expanded.component.html',
  styleUrls: ['./filter-expanded.component.scss'],
})
export class FilterExpandedComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() overflowY: string = 'scroll';
  @Input() maxHeight: string = '10rem';
}
