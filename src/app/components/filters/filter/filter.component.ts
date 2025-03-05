import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() maxHeight: string = '10rem';
  @Input() isActive: boolean = false;
}
