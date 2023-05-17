import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent {
  SelectedView = SelectedView;

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
    return Object.keys(this.map.allLocationsByLetter).length > 0;
  }
}
