import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { SearchService } from '../../services/search.service';
import { debounceTime, Subject } from 'rxjs';
import { MapService } from '../../services/map.service';
import { TranslateService } from '@ngx-translate/core';
import {
  LiveSearchResult,
  LiveSearchResultType,
  liveSearchResultTypes,
} from '../../models/live-search-result';
import { ThemeService } from '../../services/theme.service';
import { UtmRoutesService } from 'src/app/services/utm-routes.service';
import { AddressSearchResult } from 'src/app/models/adress-search-result';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent {
  liveSearchResultTypes = liveSearchResultTypes;

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  private searchInputSubject = new Subject<string>();

  SelectedView = SelectedView;

  constructor(
    public router: Router,
    public routing: RoutingService,
    public search: SearchService,
    public map: MapService,
    public translate: TranslateService,
    public themes: ThemeService,
    public utmRoutes: UtmRoutesService
  ) {
    this.searchInputSubject.pipe(debounceTime(300)).subscribe((searchInput) => {
      void this.search.updateLiveSearchResults(searchInput);
    });
  }

  onSearchInputChange(event: any) {
    this.searchInputSubject.next(event.target.value);
  }

  onSearchBlur(event: FocusEvent) {
    const clickedElement = event.relatedTarget as HTMLElement;
    const clickInsideContainer =
      clickedElement &&
      this.searchContainer.nativeElement.contains(clickedElement);
    if (!clickInsideContainer) {
      this.search.hideLiveSearchResults();
    }
  }

  onSearchFocus() {
    if (
      this.search.liveSearchResults.getValue().length > 0 ||
      this.search.addressResults.getValue().length > 0
    ) {
      this.search.showLiveSearchResults = true;
    }
  }

  async onAddressSelect(address: AddressSearchResult) {
    this.search.hideLiveSearchResults();

    const isAlreadyShowingMap =
      this.routing.getSelectedView() === SelectedView.Locations ||
      this.routing.getSelectedView() === SelectedView.SelectedRoute;
    if (!isAlreadyShowingMap) {
      await this.router.navigateByUrl('/locaties');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.map.flyTo(address.center, 16, address.place_name);
  }

  getSearchResultTypeConfig(type: LiveSearchResultType): {
    icon: string;
    titleTranslationKey: string;
    clickHandler: (url: string) => void;
  } {
    if (type === 'location') {
      return {
        icon: 'assets/ui/svg/location-dot.svg',
        titleTranslationKey: 'locations',
        clickHandler: (url: string) => this.map.selectLocationByUrlOrId(url),
      };
    }
    if (type === 'route') {
      return {
        icon: 'assets/ui/svg/route.svg',
        titleTranslationKey: 'routes',
        clickHandler: (url: string) => this.utmRoutes.selectByUrlOrId(url),
      };
    }
    if (type === 'story') {
      return {
        icon: 'assets/ui/svg/story.svg',
        titleTranslationKey: 'stories',
        clickHandler: (url: string) => this.map.selectLocationByUrlOrId(url),
      };
    }

    return {
      icon: 'assets/ui/svg/close-circle.svg',
      titleTranslationKey: 'Onbekend',
      clickHandler: (url: string) => this.map.selectLocationByUrlOrId(url),
    };
  }
}
