import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('searchContainer') searchContainer!: ElementRef;

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

  async onAddressSelect(address: any) {
    this.search.hideLiveSearchResults();

    const isAlreadyShowingMap =
      this.routing.getSelectedView() === SelectedView.Locations ||
      this.routing.getSelectedView() === SelectedView.SelectedRoute;
    if (!isAlreadyShowingMap) {
      await this.router.navigateByUrl('/locaties');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.map.flyTo(address.center);
  }
}
