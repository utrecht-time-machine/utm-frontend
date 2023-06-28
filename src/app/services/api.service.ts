import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';
import { LocationDetails } from '../models/location-details';
import { Story } from '../models/story';
import { Organisation } from '../models/organisation';
import { UtmRoute } from '../models/utm-route';
import { UtmRouteStop } from '../models/utm-route-stop';
import { MediaItem, MediaItemType } from '../models/media-item';
import { UtmTranslateService } from './utm-translate.service';
import { StaticPage } from '../models/static-page';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private utmTranslate: UtmTranslateService
  ) {}

  async getNidFromUrlAlias(url: string): Promise<string> {
    console.log('Retrieving Nid from URL alias', url + '...');
    const response: { nid: string } = await lastValueFrom(
      this.http.get<{ nid: string }>(environment.aliasToNidUrl + url)
    );
    return response.nid;
  }

  async getStaticPage(title: string): Promise<StaticPage | undefined> {
    const staticPages: StaticPage[] = await lastValueFrom(
      this.http.get<StaticPage[]>(
        environment.apiUrl + environment.apiSuffixes.staticPage + title
      )
    ).catch((err) => {
      console.error(err);
      return [];
    });

    if (staticPages.length <= 0) {
      return undefined;
    }

    const staticPage: StaticPage = staticPages[0];
    await this.utmTranslate.translateObjectByKeys(
      staticPage,
      environment.translateKeys.staticPage
    );
    return staticPage;
  }

  getMapLocations(): Observable<MapLocation[]> {
    console.log('Retrieving map locations...');
    // return this.http.get<MapLocation[]>('/assets/mock/mapLocations.json');
    return this.http.get<MapLocation[]>(
      environment.apiUrl + environment.apiSuffixes.mapLocations
    );
  }

  async getUtmRoutes(): Promise<UtmRoute[]> {
    let utmRoutes: UtmRoute[] = await lastValueFrom(
      this.http.get<UtmRoute[]>(
        environment.apiUrl + environment.apiSuffixes.routes
      )
    ).catch((err) => {
      console.error(err);
      return [];
    });
    this._addUrlPrefixes(utmRoutes, 'photo');
    this.utmTranslate.translateObjectsByKeys(
      utmRoutes,
      environment.translateKeys.routes
    );
    return utmRoutes;
  }

  async getStoryDetailsById(storyId: string): Promise<Story | undefined> {
    let storyDetails: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl + environment.apiSuffixes.storyDetailsById + storyId
      )
    );

    if (storyDetails.length < 1) {
      return undefined;
    }
    const story: Story = storyDetails[0];
    this._addUrlPrefix(story, 'photo');
    this.utmTranslate.translateObjectByKeys(
      story,
      environment.translateKeys.storyDetails
    );
    return story;
  }

  async getMediaItemsByStoryId(storyId: string): Promise<MediaItem[]> {
    if (!storyId) {
      return [];
    }

    let mediaItems: MediaItem[] = await lastValueFrom(
      this.http.get<MediaItem[]>(
        environment.apiUrl + environment.apiSuffixes.mediaByStory + storyId
      )
    );

    mediaItems.forEach((mediaItem) => {
      this.utmTranslate.translateObjectByKeys(
        mediaItem,
        environment.translateKeys.mediaItem
      );
      mediaItem.type = MediaItemType.Undefined;

      const isImageItem = mediaItem.image_small;
      if (isImageItem) {
        mediaItem.type = MediaItemType.Image;
        this._addUrlPrefix(mediaItem, 'image_small');
      }

      const isAudioItem = environment.mediaItemAudioExtensions.some(
        (audioExtension) => mediaItem.media_file.endsWith(audioExtension)
      );
      const isVideoItem = mediaItem.media_file;

      if (isAudioItem) {
        mediaItem.type = MediaItemType.Audio;
        mediaItem.media_file = environment.audioBaseUrl + mediaItem.media_file;
      } else if (isVideoItem) {
        mediaItem.type = MediaItemType.Video;
        this._addUrlPrefix(mediaItem, 'media_file');
      }

      if (mediaItem.embed_url) {
        mediaItem.type = MediaItemType.Embed;

        for (const youTubePrefix of environment.mediaItemYouTubePrefixToReplace) {
          const isYouTubeEmbed = mediaItem.embed_url.includes(youTubePrefix);
          if (isYouTubeEmbed) {
            mediaItem.embed_url = mediaItem.embed_url.replace(
              youTubePrefix,
              ''
            );
            mediaItem.embed_url =
              environment.mediaItemYouTubeEmbedUrl + mediaItem.embed_url;
            break;
          }
        }
      }

      // const isImageItem = environment.mediaItemImageExtensions.some(
      //   (imageExtension) => mediaItem.media_file.endsWith(imageExtension)
      // );
      // if (isImageItem) {
      //   mediaItem.type = MediaItemType.Image;
      //   mediaItem = this._addUrlPrefix(mediaItem, 'media_file');
      // }
    });

    // console.log(mediaItems);
    // mediaItems = this._addImageUrlPrefixes(mediaItems, 'media_file');
    return mediaItems;
  }

  async getLocationDetailsById(
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

    this._addUrlPrefix(locationDetails, 'image');
    this._addUrlPrefix(locationDetails, 'thumb');

    this.utmTranslate.translateObjectByKeys(
      locationDetails,
      environment.translateKeys.locationDetails
    );

    const splitGeoCoords: string[] = locationDetails.geo.split(', ');
    locationDetails.coords = {
      lat: parseFloat(splitGeoCoords[0]),
      lng: parseFloat(splitGeoCoords[1]),
    };

    // TODO: Enrich location/organisation details with story data asynchronously?
    const locationStories: Story[] = await this.getStoriesByLocationId(
      locationDetails.nid
    );
    locationDetails.stories = locationStories;

    const locationOrganisations: Organisation[] =
      await this._getOrganisationsByLocationId(locationDetails.nid);
    locationDetails.organisations = locationOrganisations;

    return locationDetails;
  }

  async getUtmRouteStopsById(
    routeId: string
  ): Promise<UtmRouteStop[] | undefined> {
    console.log('Retrieving route stops', routeId);

    const utmRouteStops: UtmRouteStop[] = await lastValueFrom(
      this.http.get<UtmRouteStop[]>(
        environment.apiUrl + environment.apiSuffixes.stopsByRoute + routeId
      )
    );

    utmRouteStops.forEach((stop) => {
      if (!stop?.location?.geo) {
        return;
      }
      const [lat, long] = stop.location.geo.split(',');
      stop.location.coords = {
        lat: parseFloat(lat.trim()),
        lng: parseFloat(long.trim()),
      };

      this._addUrlPrefix(stop.location, 'image');
      this._addUrlPrefix(stop.location, 'thumb');

      this.utmTranslate.translateObjectByKeys(
        stop.location,
        environment.translateKeys.locationDetails
      );

      if (stop?.stories) {
        this._addUrlPrefixes(stop.stories, 'audio', environment.audioBaseUrl);

        this.utmTranslate.translateObjectsByKeys(
          stop.stories,
          environment.translateKeys.storyDetails
        );
      }
    });

    console.log('STOPS', utmRouteStops);
    return utmRouteStops;
  }

  private _addUrlPrefix(
    obj: any,
    key: string,
    prefix: string = environment.imageBaseUrl
  ): void {
    if (key in obj) {
      obj[key] = environment.imageBaseUrl + obj[key];
    }
  }

  private _addUrlPrefixes(
    objs: any[],
    key: string,
    prefix: string = environment.imageBaseUrl
  ): void {
    for (const obj of objs) {
      this._addUrlPrefix(obj, key);
    }
  }

  public async getStoriesByLocationId(locationId: string): Promise<Story[]> {
    const stories: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl +
          environment.apiSuffixes.storiesByLocationId +
          locationId
      )
    );
    this._addUrlPrefixes(stories, 'photo');

    stories.map(
      (story) =>
        (story.story_url_alias = story.story_link.replace('/story/', ''))
    );

    this.utmTranslate.translateObjectsByKeys(
      stories,
      environment.translateKeys.storyDetails
    );
    return stories;
  }

  private async _getOrganisationsByLocationId(
    locationId: string
  ): Promise<Organisation[]> {
    const organisations: Organisation[] = await lastValueFrom(
      this.http.get<Organisation[]>(
        environment.apiUrl +
          environment.apiSuffixes.organisationsByLocation +
          locationId
      )
    );
    this._addUrlPrefixes(organisations, 'logo');
    this.utmTranslate.translateObjectsByKeys(
      organisations,
      environment.translateKeys.organisation
    );
    return organisations;
  }

  public convertMapLocationsToGeoJson(
    mapLocations: MapLocation[]
  ): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = mapLocations.map((mapLocation) => {
      const [latitude, longitude] = mapLocation.geo.split(',').map(Number);
      this._addUrlPrefix(mapLocation, 'thumb');
      this._addUrlPrefix(mapLocation, 'image_small');

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

  public async post(url: string, body: any): Promise<any> {
    const requestBody = body;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // console.log(requestBody, url);
    return await lastValueFrom(this.http.post(url, requestBody, httpOptions));
  }
}
