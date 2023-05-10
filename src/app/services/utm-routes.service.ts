import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';

@Injectable({
  providedIn: 'root',
})
export class UtmRoutesService {
  all: UtmRoute[] | undefined = undefined;

  selected: BehaviorSubject<UtmRoute | undefined> = new BehaviorSubject<
    UtmRoute | undefined
  >(undefined);

  constructor(private apiService: ApiService, private router: Router) {
    void this.load();
  }

  public async load() {
    this.all = await this.apiService.getUtmRoutes();

    console.log('Loaded all UTM routes:', this.all);
  }

  public async selectByUrl(url: string, id?: string) {
    await this.router.navigateByUrl(url);

    if (!id) {
      id = await this.apiService.getNidFromUrlAlias(url);

      const idAlreadySelected = id === this.selected.getValue()?.nid;
      if (idAlreadySelected) {
        return;
      }
    }

    if (!this.all) {
      await this.load();
    }

    if (!url || !this.all) {
      return;
    }

    const routeToSelect: UtmRoute | undefined = this.all.find(
      (r) => r.nid === id
    );
    if (!routeToSelect) {
      console.warn('Could not find route with ID', id, this.all);
      return;
    }

    const routeStops: UtmRouteStop[] | undefined =
      await this.apiService.getUtmRouteStopsById(id);
    if (routeStops) {
      routeToSelect.stops = routeStops;
    }

    this.selected.next(routeToSelect);
  }
}
