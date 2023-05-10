import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UtmRoutesService {
  all: UtmRoute[] | undefined = undefined;

  selected: BehaviorSubject<UtmRoute | undefined> = new BehaviorSubject<
    UtmRoute | undefined
  >(undefined);

  constructor(private apiService: ApiService) {
    void this.load();
  }

  public async load() {
    this.all = await this.apiService.getUtmRoutes();
    console.log('Loaded all UTM routes:', this.all);
  }
}
