import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LocationDetails } from '../../models/location-details';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { UtilService } from '../../services/util.service';
import { ThemeService } from '../../services/theme.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  SelectedView = SelectedView;
  UtilService = UtilService;

  constructor(
    public mapService: MapService,
    public router: Router,
    public routing: RoutingService,
    public themes: ThemeService,
    public time: TimeService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.mapService.initMap();
    });
  }

  public getSelectedLocation(): LocationDetails | undefined {
    return this.mapService.selectedLocation.getValue();
  }
}
