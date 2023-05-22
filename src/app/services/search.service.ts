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
      url: '/locaties/kasteel-duurstede-david-van-bourgondie',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
    {
      value:
        'Kasteel Duurstede - David van Bourgondië\tInudatiekanaal 6 Wijk bij Duurstede',
      url: '/locaties/kasteel-duurstede-david-van-bourgondie',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
    {
      value:
        'Kasteel Duurstede - David van Bourgondië\tInudatiekanaal 6 Wijk bij Duurstede',
      url: '/locaties/kasteel-duurstede-david-van-bourgondie',
      label:
        '<div class="search-view">\t<div class="name"><span>Kasteel Duurstede - David van Bourgondië</span></div>\t<div class="addr">Inudatiekanaal 6 Wijk bij Duurstede</div></div>',
    },
  ];

  liveSearchResults: BehaviorSubject<LiveSearchResult[]> = new BehaviorSubject<
    LiveSearchResult[]
  >([]);

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
}
