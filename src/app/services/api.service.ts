import { Injectable } from '@angular/core';
import { MapLocation } from '../models/map-location';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'geojson';
import { LocationDetails } from '../models/location-details';
import { Story } from '../models/story';
import { UtmRoute } from '../models/utm-route';
import { UtmRouteStop } from '../models/utm-route-stop';
import { MediaItem, MediaItemType } from '../models/media-item';
import { UtmTranslateService } from './utm-translate.service';
import { StaticPage } from '../models/static-page';
import { OrganisationService } from './organisation.service';
import { UtilService } from './util.service';
import { Theme } from '../models/theme';

// TODO: centreer tekst beginstuk
const mockHomeBlocks: StaticPage[] = [
  {
    title: 'Welkom in de<br/>Utrecht Time Machine',
    body: '', // Not used!
    nid: '90001',
    view_node: '/block-1',
    photo: '/assets/temp-images/limes_kaart.jpg',
  },
  {
    title: 'Herontdek de Stad Utrecht',
    body:
      '<p>Heb je ooit gewandeld of gefietst door de straten van Utrecht en je afgevraagd hoe het vroeger was? De UTM is jouw <strong>persoonlijke gids door de tijd</strong>: door verborgen kloostergangen, langs de oude gasfabriek in het Griftpark en de oude staalfabriek Werkspoor in Zuilen, op de oude stadsmuren en in het oude paleis Lofen.</p>' +
      '\n' +
      '<p>Je kan zelf kiezen welke plekken je bezoekt en bestaande routes volgen, of je eigen route door de stad samenstellen. <strong>De rijke geschiedenis van de stad Utrecht wacht op je</strong>.</p>',
    nid: '90002',
    view_node: '/block-2',
    photo: '/assets/temp-images/Utrecht Stad X62345 - 300737.jpg',
  },
  {
    title: 'Ontdek verborgen erfgoed in de provincie',
    body: '<p>In de provincie Utrecht gaat de geschiedenis ook <strong>buiten de stad verder</strong>. Ontdek de verdedigingswerken van de Hollandse Waterlinies, trek langs de oude tankgrachten of verken de Utrechtse Heuvelrug waar het verleden voelbaar is in het landschap. De Utrecht Time Machine brengt de geschiedenis tot leven, direct op je smartphone. <strong>Zo verandert elke wandeling of fietstocht in een spannende tijdsreis door de provincie</strong>. Ontdek erfgoed op jouw manier, en laat je verrassen door wat je tegenkomt!</p>',
    nid: '90003',
    view_node: '/block-3',
    photo: '/assets/temp-images/Utrecht Provincie 1_2065_0013.jpg',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private utmTranslate: UtmTranslateService,
    private organisations: OrganisationService,
  ) {}

  async getNidFromUrlAlias(url: string): Promise<string> {
    console.log('Retrieving Nid from URL alias', url + '...');
    const response: { nid: string } = await lastValueFrom(
      this.http.get<{ nid: string }>(environment.aliasToNidUrl + url),
    );
    return response.nid;
  }

  async getStaticPage(nid: string): Promise<StaticPage | undefined> {
    const staticPages: StaticPage[] = await lastValueFrom(
      this.http.get<StaticPage[]>(environment.apiUrl + environment.apiSuffixes.staticPage + nid),
    ).catch(err => {
      console.error(err);
      return [];
    });

    if (staticPages.length <= 0) {
      return undefined;
    }

    const staticPage: StaticPage = staticPages[0];
    UtilService.addUrlPrefix(staticPage, 'photo');
    await this.utmTranslate.translateObjectByKeys(staticPage, environment.translateKeys.staticPage);
    return staticPage;
  }

  async getHomeBlocks(): Promise<StaticPage[] | undefined> {
    // TODO: add in again once received from backend
    // const blocks: StaticPage[] = await lastValueFrom(
    //   // TODO: change url to correct endpoint once available
    //   this.http.get<StaticPage[]>(
    //     environment.apiUrl + environment.apiSuffixes.staticPage
    //   )
    // ).catch((err) => {
    //   console.error(err);
    //   return [];
    // });
    //
    // if (blocks.length <= 0) {
    //   return undefined;
    // }

    const blocks = mockHomeBlocks;

    const processedBlocks = blocks.map(async block => {
      // TODO: add in again once received from backend
      // UtilService.addUrlPrefix(block, 'photo');
      await this.utmTranslate.translateObjectByKeys(block, environment.translateKeys.staticPage);
      return block;
    });

    return Promise.all(processedBlocks);
  }

  getMapLocations(): Observable<MapLocation[]> {
    console.log('Retrieving map locations...');
    // return this.http.get<MapLocation[]>('/assets/mock/mapLocations.json');
    return this.http.get<MapLocation[]>(environment.apiUrl + environment.apiSuffixes.mapLocations);
  }

  async getUtmRoutes(): Promise<UtmRoute[]> {
    let utmRoutes: UtmRoute[] = await lastValueFrom(
      this.http.get<UtmRoute[]>(environment.apiUrl + environment.apiSuffixes.routes),
    ).catch(err => {
      console.error(err);
      return [];
    });

    UtilService.addUrlPrefixes(utmRoutes, 'geojson_url', environment.geoJsonBaseUrl);

    UtilService.addUrlPrefixes(utmRoutes, 'audio');
    UtilService.addUrlPrefixes(utmRoutes, 'photo');
    this.utmTranslate.translateObjectsByKeys(utmRoutes, environment.translateKeys.routes);

    utmRoutes.forEach(utmRoute => {
      if (!utmRoute.show_only_in_dev_mode_plaintext) {
        utmRoute.show_only_in_dev_mode = false;
      } else if (utmRoute.show_only_in_dev_mode_plaintext === '1') {
        utmRoute.show_only_in_dev_mode = true;
      }

      const splitStringToArray = (str?: string): string[] => {
        return str ? str.split(', ') : [];
      };

      if (utmRoute.theme_ids_str) {
        utmRoute.theme_ids = splitStringToArray(utmRoute.theme_ids_str);
      }

      if (utmRoute.organisation_ids_str) {
        utmRoute.organisation_ids = splitStringToArray(utmRoute.organisation_ids_str);
      }
    });
    return utmRoutes;
  }

  async getThemes(): Promise<Theme[]> {
    let themes: Theme[] = await lastValueFrom(
      this.http.get<Theme[]>(environment.apiUrl + environment.apiSuffixes.allThemes),
    ).catch(err => {
      console.error(err);
      return [];
    });
    //
    // UtilService.addUrlPrefixes(
    //   utmRoutes,
    //   'geojson_url',
    //   environment.geoJsonBaseUrl
    // );
    //
    // UtilService.addUrlPrefixes(utmRoutes, 'audio');
    // UtilService.addUrlPrefixes(utmRoutes, 'photo');

    void this.utmTranslate.translateObjectsByKeys(themes, environment.translateKeys.themes);

    return themes;
  }

  async getStoryDetailsById(storyId: string): Promise<Story | undefined> {
    let storyDetails: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl + environment.apiSuffixes.storyDetailsById + storyId,
      ),
    );

    if (storyDetails.length < 1) {
      return undefined;
    }
    const story: Story = storyDetails[0];
    UtilService.addUrlPrefix(story, 'photo');

    if (story.audio) {
      UtilService.addUrlPrefix(story, 'audio', environment.audioBaseUrl);
    }

    this.utmTranslate.translateObjectByKeys(story, environment.translateKeys.storyDetails);
    return story;
  }

  async getMediaItemsByStoryId(storyId: string): Promise<MediaItem[]> {
    if (!storyId) {
      return [];
    }

    let mediaItems: MediaItem[] = await lastValueFrom(
      this.http.get<MediaItem[]>(
        environment.apiUrl + environment.apiSuffixes.mediaByStory + storyId,
      ),
    );

    mediaItems.forEach(mediaItem => {
      this.utmTranslate.translateObjectByKeys(mediaItem, environment.translateKeys.mediaItem);

      const mediaItemOrgIds: string[] = mediaItem.organisation_ids.split(',');
      mediaItem.organisations = this.organisations.getByIds(mediaItemOrgIds);

      mediaItem.type = MediaItemType.Undefined;

      const isImageItem = mediaItem.image_small;
      if (isImageItem) {
        mediaItem.type = MediaItemType.Image;
        UtilService.addUrlPrefix(mediaItem, 'image_small');
      }

      const isAudioItem = environment.mediaItemAudioExtensions.some(audioExtension =>
        mediaItem.media_file.endsWith(audioExtension),
      );
      const isVideoItem = mediaItem.media_file;

      if (isAudioItem) {
        mediaItem.media_file = environment.audioBaseUrl + mediaItem.media_file;
        mediaItem.has_audio = true;
      } else if (isVideoItem) {
        mediaItem.type = MediaItemType.Video;
        UtilService.addUrlPrefix(mediaItem, 'media_file');
      }

      if (mediaItem.ar_360_photo) {
        mediaItem.type = MediaItemType.AR;
        UtilService.addUrlPrefix(mediaItem, 'ar_360_photo');
      }

      if (mediaItem.ar_360_video) {
        mediaItem.type = MediaItemType.AR;
        UtilService.addUrlPrefix(mediaItem, 'ar_360_video');
      }

      if (mediaItem.embed_url) {
        mediaItem.type = MediaItemType.Embed;

        for (const youTubePrefix of environment.mediaItemYouTubePrefixToReplace) {
          const isYouTubeEmbed = mediaItem.embed_url.includes(youTubePrefix);
          if (isYouTubeEmbed) {
            mediaItem.embed_url = mediaItem.embed_url.replace(youTubePrefix, '');
            mediaItem.embed_url = environment.mediaItemYouTubeEmbedUrl + mediaItem.embed_url;
            break;
          }
        }
      }

      // const isImageItem = environment.mediaItemImageExtensions.some(
      //   (imageExtension) => mediaItem.media_file.endsWith(imageExtension)
      // );
      // if (isImageItem) {
      //   mediaItem.type = MediaItemType.Image;
      //   mediaItem = UtilService.addUrlPrefix(mediaItem, 'media_file');
      // }
    });

    // console.log(mediaItems);
    // mediaItems = this._addImageUrlPrefixes(mediaItems, 'media_file');
    return mediaItems;
  }

  async getLocationDetailsById(locationId: string): Promise<LocationDetails | undefined> {
    const locationsDetails: LocationDetails[] = await lastValueFrom(
      this.http.get<LocationDetails[]>(
        environment.apiUrl + environment.apiSuffixes.locationDetailsById + locationId,
      ),
    );
    if (locationsDetails.length < 1) {
      return undefined;
    }

    const locationDetails: LocationDetails = locationsDetails[0];

    UtilService.addUrlPrefix(locationDetails, 'image');
    UtilService.addUrlPrefix(locationDetails, 'thumb');

    this.utmTranslate.translateObjectByKeys(
      locationDetails,
      environment.translateKeys.locationDetails,
    );

    const splitGeoCoords: string[] = locationDetails.geo.split(',').map(coord => coord.trim());
    locationDetails.coords = {
      lat: parseFloat(splitGeoCoords[0]),
      lng: parseFloat(splitGeoCoords[1]),
    };

    // TODO: Enrich location/organisation details with story data asynchronously?
    const locationStories: Story[] = await this.getStoriesByLocationId(locationDetails.nid);
    locationDetails.stories = locationStories;

    if (locationDetails?.organisation_ids) {
      const orgIds: string[] = locationDetails?.organisation_ids.split(',');
      locationDetails.organisations = this.organisations.getByIds(orgIds);
    }

    return locationDetails;
  }

  async getUtmRouteStopsById(routeId: string): Promise<UtmRouteStop[] | undefined> {
    console.log('Retrieving route stops', routeId);

    const utmRouteStops: UtmRouteStop[] = await lastValueFrom(
      this.http.get<UtmRouteStop[]>(
        environment.apiUrl + environment.apiSuffixes.stopsByRoute + routeId,
      ),
    );

    utmRouteStops.forEach(stop => {
      if (stop.audio) {
        UtilService.addUrlPrefix(stop, 'audio', environment.audioBaseUrl);
      }

      if (stop.audio_english) {
        UtilService.addUrlPrefix(stop, 'audio_english', environment.audioBaseUrl);
      }

      stop.show_location_info = (stop.show_location_info as any) === '1';

      this.utmTranslate.translateObjectByKeys(stop, environment.translateKeys.stop);
    });

    console.log('STOPS', utmRouteStops);
    return utmRouteStops;
  }

  public async getStoriesByLocationId(locationId: string): Promise<Story[]> {
    const stories: Story[] = await lastValueFrom(
      this.http.get<Story[]>(
        environment.apiUrl + environment.apiSuffixes.storiesByLocationId + locationId,
      ),
    );
    UtilService.addUrlPrefixes(stories, 'photo');

    stories.map(story => {
      story.story_url_alias = story.story_link.replace('/story/', '');
      story.theme_ids = story.theme_ids_str ? story.theme_ids_str.split(', ') : [];
    });

    this.utmTranslate.translateObjectsByKeys(stories, environment.translateKeys.storyDetails);
    return stories;
  }

  public convertMapLocationsToGeoJson(mapLocations: MapLocation[]): GeoJSON.FeatureCollection {
    const features: GeoJSON.Feature[] = mapLocations.map(mapLocation => {
      const [latitude, longitude] = mapLocation.geo.split(',').map(Number);
      UtilService.addUrlPrefix(mapLocation, 'thumb');
      UtilService.addUrlPrefix(mapLocation, 'image_small');

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

  public convertLocationDetailsToStory(locationDetails: LocationDetails): Story {
    const locationMediaItem: MediaItem = {
      caption: locationDetails.caption as string,
      embed_url: '',
      has_audio: false,
      image_small: locationDetails.image as string,
      license: locationDetails.license as string,
      media_file: '',
      media_id: '',
      organisation_ids: '',
      organisations: locationDetails.organisations,
      source_link: '',
      source_name: '',
      ar_360_photo: '',
      ar_360_photo_default_yaw: 0,
      ar_360_photo_default_pitch: 0,
      ar_360_photo_default_zoom: 50,
      ar_360_video: '',
      text: `<div>${locationDetails.teaser as string}</div><div>${
        locationDetails.text as string
      }</div>`,
      title: locationDetails.title as string,
      type: MediaItemType.Image,
    };

    return {
      audio: '',
      has_video_icon: '',
      location_id: locationDetails.nid,
      location_title: locationDetails.title as string,
      location_url: locationDetails.url as string,
      nid: '',
      photo: locationDetails.image as string,
      story_id: '',
      story_link: '',
      story_url_alias: '',
      title: locationDetails.title as string,
      mediaItems: [locationMediaItem],
      theme_ids_str: '',
      min_date_str: '',
      max_date_str: '',
    };
  }
}
