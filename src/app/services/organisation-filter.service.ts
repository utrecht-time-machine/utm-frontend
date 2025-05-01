import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Organisation } from '../models/organisation';
import { OrganisationService } from './organisation.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationFilterService {
  selectedIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  numTimesSelectedOrganisationsChanged = 0;

  constructor(public organisations: OrganisationService) {
    this.selectedIds.subscribe(() => {
      this.numTimesSelectedOrganisationsChanged++;
    });
  }

  toggle(id: string) {
    let selectedIds = this.selectedIds.value;
    if (this.isSelected(id)) {
      selectedIds = selectedIds.filter((selId) => selId !== id);
    } else {
      selectedIds.push(id);
    }
    this.selectedIds.next(selectedIds);
  }

  isSelected(id: string) {
    return this.selectedIds.value.includes(id);
  }

  clearSelection() {
    this.selectedIds.next([]);
  }

  isActive(): boolean {
    return this.selectedIds.value.length > 0;
  }
}
