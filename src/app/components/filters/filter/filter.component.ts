import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() overflowY: string = 'scroll';
  @Input() maxHeight: string = '10rem';
}
