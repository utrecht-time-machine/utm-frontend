import { Component } from '@angular/core';
import { OrganisationFilterService } from '../../../../services/organisation-filter.service';
import { FilterComponent } from '../filter.component';
import { FilterService } from '../../../../services/filter.service';
import { FilterType } from '../../../../models/filter-type.enum';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-organisation-filter',
  templateUrl: './organisation-filter.component.html',
  styleUrls: ['./organisation-filter.component.scss'],
  standalone: false,
})
export class OrganisationFilterComponent extends FilterComponent {
  constructor(
    public organisationFilter: OrganisationFilterService,
    public filters: FilterService,
    public organisations: OrganisationService,
  ) {
    super();
  }

  get numSelectedOrganisationsStr(): string {
    const numSelected = this.organisationFilter.selectedIds.value.length;
    if (numSelected === 0) {
      return '';
    }
    return ` (${numSelected.toString()})`;
  }

  onClose() {}

  protected readonly FilterType = FilterType;
}
