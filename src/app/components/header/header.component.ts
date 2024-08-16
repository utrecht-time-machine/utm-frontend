import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { SearchService } from '../../services/search.service';
import { debounceTime, Subject } from 'rxjs';
import { MapService } from '../../services/map.service';
import { TranslateService } from '@ngx-translate/core';
import { LiveSearchResult } from '../../models/live-search-result';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private searchInputSubject = new Subject<string>();

  SelectedView = SelectedView;

  constructor(
    public router: Router,
    public routing: RoutingService,
    public search: SearchService,
    public map: MapService,
    public translate: TranslateService,
    public themes: ThemeService
  ) {
    this.searchInputSubject.pipe(debounceTime(300)).subscribe((searchInput) => {
      void this.search.updateLiveSearchResults(searchInput);
    });
  }

  onSearchInputChange(event: any) {
    this.searchInputSubject.next(event.target.value);
  }

  onSearchResultClicked($event: MouseEvent, searchResult: LiveSearchResult) {
    void this.themes.clearSelection();
    // TODO: Better way to prevent fit to bounds because of theme change (needs to zoom to specific location, not all location bounds)
    setTimeout(() => {
      void this.map.selectLocationByUrlOrId(searchResult.url);
    });
  }
}
