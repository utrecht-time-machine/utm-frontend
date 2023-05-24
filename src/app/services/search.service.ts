import { Injectable } from '@angular/core';
import { LiveSearchResult } from '../models/live-search-result';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  liveSearchResults: BehaviorSubject<LiveSearchResult[]> = new BehaviorSubject<
    LiveSearchResult[]
  >([]);

  showLiveSearchResults = false;
  isLoadingLiveSearchResults = false;

  constructor(private http: HttpClient) {}

  async updateLiveSearchResults(searchInput: string) {
    if (!searchInput) {
      this.removeLiveSearchResults();
      return;
    }

    this.isLoadingLiveSearchResults = true;
    const searchResults: LiveSearchResult[] = await lastValueFrom(
      this.http.get<LiveSearchResult[]>(environment.liveSearchUrl + searchInput)
    );
    setTimeout(() => {
      this.liveSearchResults.next(searchResults);
      this.isLoadingLiveSearchResults = false;
    }, 500);
  }

  removeLiveSearchResults() {
    this.liveSearchResults.next([]);
  }

  hideLiveSearchResults() {
    // TODO: Find more elegant fix for this (hiding on search results on blur disallows click on results)
    setTimeout(() => (this.showLiveSearchResults = false), 100);
  }
}
