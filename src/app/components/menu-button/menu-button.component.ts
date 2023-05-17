import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { MapService } from '../../services/map.service';
import { MapLocation } from '../../models/map-location';

enum MenuSortOn {
  Title,
  Address,
}

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent {
  SelectedView = SelectedView;

  menuIsSortedOn: MenuSortOn = MenuSortOn.Title;
  MenuSortOn = MenuSortOn;

  alphabet: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  constructor(
    public menuService: MenuService,
    public router: Router,
    public routing: RoutingService,
    public map: MapService
  ) {}

  public get locationsByLetterAreLoaded(): boolean {
    if (this.menuIsSortedOn === MenuSortOn.Title) {
      return Object.keys(this.menuService.allLocationsSortedByTitle).length > 0;
    } else if (this.menuIsSortedOn === MenuSortOn.Address) {
      return (
        Object.keys(this.menuService.allLocationsSortedByAddress).length > 0
      );
    }

    console.warn('Menu sorted on unknown variable');
    return false;
  }

  public get locationsByLetter(): { [letter: string]: MapLocation[] } {
    if (this.menuIsSortedOn === MenuSortOn.Title) {
      return this.menuService.allLocationsSortedByTitle.getValue();
    } else if (this.menuIsSortedOn === MenuSortOn.Address) {
      return this.menuService.allLocationsSortedByAddress.getValue();
    }

    console.warn('Menu sorted on unknown variable');
    return {};
  }

  public toggleMenuSort() {
    if (this.menuIsSortedOn === MenuSortOn.Title) {
      this.menuIsSortedOn = MenuSortOn.Address;
    } else if (this.menuIsSortedOn === MenuSortOn.Address) {
      this.menuIsSortedOn = MenuSortOn.Title;
    } else {
      console.warn('Menu sorted on unknown variable');
    }
  }
}
