import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // azMenuIsShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  toggleAzMenu() {
    // this.azMenuIsShown.next(!this.azMenuIsShown.getValue());
    document.getElementsByTagName('body')[0].classList.toggle('menu-az-on');
  }
}
