import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';
import { LocationDetails } from '../models/location-details';
import { Story } from '../models/story';
import { Organisation } from '../models/organisation';
import { UtmRoute } from '../models/utm-route';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async getNidFromUrlAlias(url: string): Promise<string> {
    console.log('Retrieving Nid from URL alias', url + '...');
    const response: { nid: string } = await lastValueFrom(
      this.http.get<{ nid: string }>(environment.aliasToNidUrl + url)
    );
    return response.nid;
  }

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

  async getUtmRoutes(): Promise<UtmRoute[]> {
    let utmRoutes: UtmRoute[] = await lastValueFrom(
      this.http.get<UtmRoute[]>(
        environment.apiUrl + environment.apiSuffixes.routes
      )
    );
    utmRoutes = this._addImageUrlPrefixes(utmRoutes, 'photo');
    return utmRoutes;
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

    const locationDetails: LocationDetails = locationsDetails[0];

    this._addImageUrlPrefix(locationDetails, 'image');

    const splitGeoCoords: string[] = locationDetails.geo.split(', ');
    locationDetails.coords = {
      lat: parseFloat(splitGeoCoords[0]),
      long: parseFloat(splitGeoCoords[1]),
    };

    // TODO: Enrich location/organisation details with story data asynchronously?
    const locationStories: Story[] = await this._getStoriesByLocationId(
      locationDetails.nid
    );
    locationDetails.stories = locationStories;

    const locationOrganisations: Organisation[] =
      await this._getOrganisationsByLocationId(locationDetails.nid);
    locationDetails.organisations = locationOrganisations;

    return locationDetails;
  }

  private _addImageUrlPrefix(obj: any, imageKey: string): any {
    if (imageKey in obj) {
      obj[imageKey] = environment.imageBaseUrl + obj[imageKey];
    }
    return obj;
  }

  private _addImageUrlPrefixes(objs: any[], imageKey: string): any[] {
    const updatedObjs: any[] = [];
    for (const obj of objs) {
      const updatedObj: any = this._addImageUrlPrefix(obj, imageKey);
      updatedObjs.push(updatedObj);
    }
    return updatedObjs;
  }

  private async _getStoriesByLocationId(locationId: string): Promise<Story[]> {
    let stories: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl +
          environment.apiSuffixes.storiesByLocationId +
          locationId
      )
    );
    stories = this._addImageUrlPrefixes(stories, 'photo');
    return stories;
  }

  private async _getOrganisationsByLocationId(
    locationId: string
  ): Promise<Organisation[]> {
    let organisations: Organisation[] = await lastValueFrom(
      this.http.get<Organisation[]>(
        environment.apiUrl +
          environment.apiSuffixes.organisationsByLocation +
          locationId
      )
    );
    organisations = this._addImageUrlPrefixes(organisations, 'logo');
    return organisations;
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
