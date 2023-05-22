import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { SearchService } from '../../services/search.service';
import { debounceTime, Subject } from 'rxjs';
import { MapService } from '../../services/map.service';

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
    public map: MapService
  ) {
    this.searchInputSubject.pipe(debounceTime(300)).subscribe((searchInput) => {
      void this.search.updateLiveSearchResults(searchInput);
    });
  }

  onSearchInputChange(event: any) {
    this.searchInputSubject.next(event.target.value);
  }
}
