import { Component, Input } from '@angular/core';
import { Organisation } from '../../models/organisation';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent {
  @Input() organisations: Organisation[] | undefined;

  constructor() {}

  hasOrganisations(): boolean {
    return this.organisations !== undefined && this.organisations.length > 0;
  }
}
