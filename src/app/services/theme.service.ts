import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  all: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);
  filtered: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);
  selectedIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  numTimesSelectedThemesChanged = 0;

  icon: string = 'library_books';
  searchText: string = '';

  constructor(public api: ApiService) {
    void this.updateAllFromServer();

    this.selectedIds.subscribe((selectedIds) => {
      console.log('Selected theme IDs:', selectedIds);
      this.numTimesSelectedThemesChanged++;
    });
  }

  async updateAllFromServer() {
    console.log('Updating all themes from server...');
    const themes = await this.api.getThemes();
    const sortedThemes = themes.sort((a, b) => a.title.localeCompare(b.title));
    console.log('All themes (from server):', sortedThemes);

    this.all.next(sortedThemes);
    this.filtered.next(sortedThemes);

    // const allIds = themes.map((theme) => theme.nid);
    // this.selectedIds.next(allIds);
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

  isActive(): boolean {
    return this.selectedIds.value.length > 0;
  }

  filterThemes() {
    const searchText = this.searchText.toLowerCase();
    const filteredThemes = this.all.value.filter((theme) =>
      theme.title.toLowerCase().includes(searchText),
    );
    this.filtered.next(filteredThemes);
  }
}
