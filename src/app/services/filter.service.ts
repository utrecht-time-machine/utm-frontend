import { Injectable } from '@angular/core';
import { FilterLocation } from '../models/filter-location.enum';
import { FilterType } from '../models/filter-type.enum';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _showing: {
    [location in FilterLocation]: { [type in FilterType]: boolean };
  } = {
    [FilterLocation.Map]: {
      [FilterType.Time]: false,
      [FilterType.Theme]: false,
    },
    [FilterLocation.Stories]: {
      [FilterType.Time]: false,
      [FilterType.Theme]: false,
    },
  };

  constructor() {}

  isShowing(location: FilterLocation, type: FilterType) {
    return this._showing[location][type];
  }

  show(location: FilterLocation, type: FilterType) {
    this._showing[location][type] = true;
  }

  hide(location: FilterLocation, type: FilterType) {
    this._showing[location][type] = false;
  }

  hideAllForLocation(location: FilterLocation) {
    this._showing[location] = {
      [FilterType.Time]: false,
      [FilterType.Theme]: false,
    };
  }
}
