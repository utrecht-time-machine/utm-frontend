import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { LocationDetails } from '../../models/location-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor(
    public mapService: MapService,
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.mapService.initMap();
  }

  public getSelectedLocation(): LocationDetails | undefined {
    return this.mapService.selectedLocation.getValue();
  }
}
