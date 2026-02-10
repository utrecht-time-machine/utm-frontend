import { Component, Input } from '@angular/core';
import { Organisation } from '../../models/organisation';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
  standalone: false,
})
export class OrganisationsComponent {
  @Input() organisations: Organisation[] | undefined;

  constructor() {}

  hasOrganisations(): boolean {
    if (!this.organisations) {
      return false;
    }
    return this.organisations.length > 0;
  }
}
