import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
})
export class SelectedItemComponent {
  @Input() title: string = '';
  @Input() location: string = '';
  @Input() introText: string = '';
  @Input() readMoreText: string = '';

  constructor() {}
}
