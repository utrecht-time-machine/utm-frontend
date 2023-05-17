import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MapLocation } from '../models/map-location';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  allLocationsSortedByTitle: BehaviorSubject<{
    [letter: string]: MapLocation[];
  }> = new BehaviorSubject<{ [p: string]: MapLocation[] }>({});

  allLocationsSortedByAddress: BehaviorSubject<{
    [letter: string]: MapLocation[];
  }> = new BehaviorSubject<{ [p: string]: MapLocation[] }>({});

  constructor(private router: Router, private map: MapService) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.closeAllMenus();
      }
    });

    this.map.allLocations.subscribe(() => {
      this._updateAllLocationsByLetter();
    });
  }

  closeAllMenus() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('menu-az-on');
    body.classList.remove('menu-mb-on');
  }

  toggleAzMenu() {
    document.getElementsByTagName('body')[0].classList.toggle('menu-az-on');
  }

  toggleMbMenu() {
    document.getElementsByTagName('body')[0].classList.toggle('menu-mb-on');
  }

  private _updateAllLocationsByLetter() {
    for (const sortKey of ['title', 'address']) {
      const sortedLocations = this.map.allLocations.getValue().sort((a, b) => {
        return (a as any)[sortKey].localeCompare((b as any)[sortKey]);
      });
      const sortedLocationsByLetter: { [letter: string]: MapLocation[] } = {};

      sortedLocations.forEach((obj) => {
        const sortValue = (obj as any)[sortKey];
        if (!sortValue) {
          return;
        }
        const firstLetter = sortValue[0].toUpperCase();
        if (!sortedLocationsByLetter[firstLetter]) {
          sortedLocationsByLetter[firstLetter] = [];
        }
        sortedLocationsByLetter[firstLetter].push(obj);
      });

      if (sortKey === 'title') {
        this.allLocationsSortedByTitle.next(sortedLocationsByLetter);
      } else if (sortKey === 'address') {
        this.allLocationsSortedByAddress.next(sortedLocationsByLetter);
      } else {
        console.warn('Sorting locations on unknown key...');
      }
    }
  }
}
