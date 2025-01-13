import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  all: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);
  selectedIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  numTimesSelectedThemesChanged = 0;

  icon: string = 'library_books';

  constructor(public api: ApiService) {
    void this.updateAllFromServer();

    this.selectedIds.subscribe((selectedIds) => {
      console.log('SELECTED THEME IDS', selectedIds);
      this.numTimesSelectedThemesChanged++;
    });
  }

  async updateAllFromServer() {
    const themes = await this.api.getThemes();
    const sortedThemes = themes.sort((a, b) => a.title.localeCompare(b.title));
    this.all.next(sortedThemes);
    
    const allIds = themes.map((theme) => theme.nid);
    // this.selectedIds.next(allIds);
    console.log('THEMES', themes);
  }

  toggle(nid: string) {
    let selectedIds = this.selectedIds.value;

    if (this.isSelected(nid)) {
      selectedIds = selectedIds.filter((id) => id !== nid);
    } else {
      selectedIds.push(nid);
    }
    this.selectedIds.next(selectedIds);
  }

  isSelected(nid: string) {
    return this.selectedIds.value.includes(nid);
  }

  shouldShow(nids: string[]): boolean {
    const noThemesSelected = this.selectedIds.value.length === 0;
    if (noThemesSelected) {
      return true;
    }
    return nids.some((nid) => this.selectedIds.value.includes(nid));
  }

  clearSelection() {
    this.selectedIds.next([]);
  }
}
