import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.closeAllMenus();
      }
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
}
