import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor(public mapService: MapService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.mapService.initMap();
  }
}
