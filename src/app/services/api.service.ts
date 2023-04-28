import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getMapLocations(): Observable<MapLocation[]> {
    console.log('Retrieving map locations...');
    // return this.http.get<MapLocation[]>('/assets/mock/mapLocations.json');
    return this.http.get<MapLocation[]>(
      environment.apiUrl + environment.apiSuffixes.mapLocations
    );
  }

  async getMapLocationsGeoJson(): Promise<GeoJSON.FeatureCollection> {
    const mapLocations: MapLocation[] = await lastValueFrom(
      this.getMapLocations()
    );
    return this._convertMapLocationsToGeoJson(mapLocations);
  }

  private _convertMapLocationsToGeoJson(
    mapLocations: MapLocation[]
  ): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = mapLocations.map((mapLocation) => {
      const [latitude, longitude] = mapLocation.geo.split(',').map(Number);
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          title: mapLocation.title,
          address: mapLocation.address,
          city: mapLocation.city,
          thumb: environment.imageBaseUrl + mapLocation.thumb,
          url: mapLocation.url,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
