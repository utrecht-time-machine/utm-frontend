import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';
import { LocationDetails } from '../models/location-details';
import { Story } from '../models/story';
import { Organisation } from '../models/organisation';

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

    const locationDetails: LocationDetails = locationsDetails[0];

    if (locationDetails.image) {
      locationDetails.image = environment.imageBaseUrl + locationDetails.image;
    }

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

  private async _getStoriesByLocationId(locationId: string): Promise<Story[]> {
    let stories: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl +
          environment.apiSuffixes.storiesByLocationId +
          locationId
      )
    );
    stories = stories.map((story) => {
      story.photo = environment.imageBaseUrl + story.photo;
      return story;
    });
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
    organisations = organisations.map((org) => {
      org.logo = environment.imageBaseUrl + org.logo;
      return org;
    });
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
