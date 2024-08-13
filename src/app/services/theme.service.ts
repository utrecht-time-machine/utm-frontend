import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  all: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);
  showingSelectionScreen = false;

  constructor(public api: ApiService) {
    void this.updateAllFromServer();
  }

  async updateAllFromServer() {
    const themes = await this.api.getThemes();
    this.all.next(themes);
    console.log('THEMES', themes);
  }
}
