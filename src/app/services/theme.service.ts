import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  all: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);

  constructor(public api: ApiService) {
    void this.updateAllFromServer();
  }

  async updateAllFromServer() {
    const themes = await this.api.getThemes();
    console.log('THEMES', themes);
  }
}
