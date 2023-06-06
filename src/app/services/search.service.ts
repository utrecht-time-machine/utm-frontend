import { Injectable } from '@angular/core';
import { LiveSearchResult } from '../models/live-search-result';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  liveSearchResults: BehaviorSubject<LiveSearchResult[]> = new BehaviorSubject<
    LiveSearchResult[]
  >([]);

  showLiveSearchResults = false;
  isLoadingLiveSearchResults = false;

  constructor(private http: HttpClient, private router: Router) {}

  async updateLiveSearchResults(searchInput: string) {
    if (!searchInput) {
      this.removeLiveSearchResults();
      return;
    }

    this.isLoadingLiveSearchResults = true;
    const searchResults: LiveSearchResult[] | void = await lastValueFrom(
      this.http.get<LiveSearchResult[]>(environment.liveSearchUrl + searchInput)
    ).catch((err) => {
      console.error(err);
    });

    if (!searchResults) {
      this.isLoadingLiveSearchResults = false;
      return;
    }

    for (const searchResult of searchResults) {
      searchResult.label = this._convertSearchResultLabelHtmlFormat(
        searchResult.label
      );
    }

    setTimeout(() => {
      this.liveSearchResults.next(searchResults);
      this.isLoadingLiveSearchResults = false;
    }, 500);
  }

  navigateToFirstSearchResult() {
    if (this.liveSearchResults.getValue().length <= 0) {
      return;
    }
    const firstSearchResult: LiveSearchResult =
      this.liveSearchResults.getValue()[0];
    if (!firstSearchResult.url) {
      return;
    }

    void this.router.navigateByUrl(firstSearchResult.url);
  }

  private _convertSearchResultLabelHtmlFormat(labelHtml: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(labelHtml, 'text/html');

    const nameElement = doc.querySelector('.field--name-title');
    if (nameElement) {
      const name = nameElement?.textContent || '';

      // TODO: Add address data if/when available
      const updatedHtml = `<div class="search-view"><div class="name"><span>${name}</span></div><div class="addr"></div></div>`;
      return updatedHtml;
    }

    return `<div class="search-view"><div class="name"><span>${labelHtml}</span></div><div class="addr"></div></div>`;
  }

  removeLiveSearchResults() {
    this.liveSearchResults.next([]);
  }

  hideLiveSearchResults() {
    // TODO: Find more elegant fix for this (hiding on search results on blur disallows click on results)
    setTimeout(() => (this.showLiveSearchResults = false), 100);
  }
}
