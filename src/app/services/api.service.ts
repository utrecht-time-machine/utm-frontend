import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';
import { LocationDetails } from '../models/location-details';

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

  async getLocationDetailsFromId(
    locationId: string
  ): Promise<LocationDetails | undefined> {
    const locationsDetails: LocationDetails[] = await lastValueFrom(
      this.http.get<LocationDetails[]>(
        environment.apiUrl +
          environment.apiSuffixes.locationDetailsById +
          locationId
      )
    );
    if (locationsDetails.length < 1) {
      return undefined;
    }
    return locationsDetails[0];
  }

  private _convertMapLocationsToGeoJson(
    mapLocations: MapLocation[]
  ): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = mapLocations.map((mapLocation) => {
      const [latitude, longitude] = mapLocation.geo.split(',').map(Number);
      mapLocation.thumb = environment.imageBaseUrl + mapLocation.thumb;
      mapLocation.image_small =
        environment.imageBaseUrl + mapLocation.image_small;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: mapLocation,
      };
    });

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
