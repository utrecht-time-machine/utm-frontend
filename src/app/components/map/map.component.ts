import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LocationDetails } from '../../models/location-details';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  SelectedView = SelectedView;
  UtilService = UtilService;

  constructor(
    public mapService: MapService,
    public router: Router,
    public routing: RoutingService
  ) {}

  ngOnInit(): void {
    this.mapService.initMap();

    const loadedLocationsPage =
      this.routing.getSelectedView() === SelectedView.Locations;
    if (loadedLocationsPage) {
      void this.mapService.selectLocationByUrl(this.router.url);
    }
  }

  public getSelectedLocation(): LocationDetails | undefined {
    return this.mapService.selectedLocation.getValue();
  }
}
