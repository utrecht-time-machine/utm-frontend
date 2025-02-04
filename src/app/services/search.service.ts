import { Injectable } from '@angular/core';
import { LiveSearchResult } from '../models/live-search-result';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AddressSearchResult } from '../models/adress-search-result';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  liveSearchResults: BehaviorSubject<LiveSearchResult[]> = new BehaviorSubject<
    LiveSearchResult[]
  >([]);
  addressResults: BehaviorSubject<AddressSearchResult[]> = new BehaviorSubject<
    AddressSearchResult[]
  >([]);

  showLiveSearchResults = false;
  isLoadingLiveSearchResults = false;

  constructor(private http: HttpClient, private router: Router) {}

  async updateLiveSearchResults(searchInput: string) {
    if (!searchInput) {
      this.removeLiveSearchResults();
      this.addressResults.next([]);
      return;
    }

    this.isLoadingLiveSearchResults = true;
    this.searchAddresses(searchInput);
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
      this.showLiveSearchResults = true;
    }, 10);
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
    this.addressResults.next([]);
  }

  private async searchAddresses(query: string) {
    const mapboxToken = environment.mapboxAccessToken;
    if (!mapboxToken) {
      console.error('Mapbox token not configured');
      return;
    }

    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json`;
    const params = {
      access_token: mapboxToken,
      country: 'NL', // Limit to Netherlands
      proximity: '5.1214,52.0907', // Utrecht coordinates for better local results
      types: 'address,place', // Only search for addresses and places
      language: 'nl', // Dutch results
    };

    try {
      const response = await lastValueFrom(
        this.http.get<any>(endpoint, { params })
      );

      const results: AddressSearchResult[] = response.features.map(
        (feature: any) => ({
          place_name: feature.place_name,
          center: feature.center,
          text: feature.text,
        })
      );

      this.addressResults.next(results);
    } catch (error) {
      console.error('Error searching addresses:', error);
      this.addressResults.next([]);
    }
  }

  hideLiveSearchResults() {
    // TODO: Find more elegant fix for this (hiding on search results on blur disallows click on results)
    setTimeout(() => (this.showLiveSearchResults = false), 100);
  }
}
