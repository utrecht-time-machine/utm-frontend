import { Component, Input } from '@angular/core';
import { LocationDetails } from '../../../models/location-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
})
export class SelectedItemComponent {
  @Input() locationDetails: LocationDetails | undefined;

  constructor(public router: Router) {}

  locationHasStories(): boolean {
    if (!this.locationDetails?.stories) {
      return false;
    }
    return this.locationDetails.stories.length > 0;
  }

  locationHasOrganisations(): boolean {
    if (!this.locationDetails?.organisations) {
      return false;
    }
    return this.locationDetails.organisations.length > 0;
  }
}
