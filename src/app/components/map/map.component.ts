import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { MapLocation } from '../../models/map-location';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor(private mapService: MapService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.mapService.initMap();
  }
}
