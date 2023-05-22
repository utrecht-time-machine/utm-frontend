import { Injectable } from '@angular/core';
import { LiveSearchResult } from '../models/live-search-result';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  mockLiveSearchResults: LiveSearchResult[] = [
    {
      value:
        'Kasteel Duurstede - David van Bourgondië\tInudatiekanaal 6 Wijk bij Duurstede',
      url: '/locaties/fort-blauwkapel',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
    {
      value:
        'Kasteel Duurstede - David van Bourgondië\tInudatiekanaal 6 Wijk bij Duurstede',
      url: '/locaties/fort-blauwkapel',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
    {
      value:
        'Kasteel Duurstede - David van Bourgondië\tInudatiekanaal 6 Wijk bij Duurstede',
      url: '/locaties/fort-blauwkapel',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
  ];

  liveSearchResults: BehaviorSubject<LiveSearchResult[]> = new BehaviorSubject<
    LiveSearchResult[]
  >([]);

  showLiveSearchResults = false;
  isLoadingLiveSearchResults = false;

  constructor() {}

  async updateLiveSearchResults(searchInput: string) {
    if (!searchInput) {
      this.removeLiveSearchResults();
      return;
    }

    this.isLoadingLiveSearchResults = true;
    setTimeout(() => {
      this.liveSearchResults.next(this.mockLiveSearchResults);
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
