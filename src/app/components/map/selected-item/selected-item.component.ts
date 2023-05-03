import { Component, Input } from '@angular/core';
import { LocationDetails } from '../../../models/location-details';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
})
export class SelectedItemComponent {
  @Input() locationDetails: LocationDetails | undefined;

  constructor() {}
}
