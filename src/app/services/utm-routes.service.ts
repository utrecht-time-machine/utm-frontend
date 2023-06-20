import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';
import { MediaItem, MediaItemType } from '../models/media-item';
import { SpinnerService } from './spinner.service';
import { PlatformService } from './platform.service';
import { Story } from '../models/story';

@Injectable({
  providedIn: 'root',
})
export class UtmRoutesService {
  all: UtmRoute[] | undefined = undefined;

  selected: BehaviorSubject<UtmRoute | undefined> = new BehaviorSubject<
    UtmRoute | undefined
  >(undefined);

  selectedStopIdx: BehaviorSubject<number | undefined> = new BehaviorSubject<
    number | undefined
  >(undefined);

  shownMediaItems: BehaviorSubject<MediaItem[] | undefined> =
    new BehaviorSubject<MediaItem[] | undefined>(undefined);

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: SpinnerService,
    private platform: PlatformService
  ) {
    void this.load();

    this._resetPreviousStopIndexOnRouteChange();

    this.selectedStopIdx.subscribe(() => {
      void this._updateSelectedStopMediaItems();
      void this._updateSelectedStopMediaItemsFromLocationStories();
    });
  }

  private _resetPreviousStopIndexOnRouteChange() {
    this.selected.subscribe(() => {
      this.selectedStopIdx.next(undefined);
    });
  }

  private async _updateSelectedStopMediaItems() {
    if (!this.selectedStop) {
      return;
    }

    const stopIsLocation = this.selectedStop.stop_type === 'Locatie';
    if (stopIsLocation) {
      let stopText = this.selectedStop.location_teaser as string;

      if (this.selectedStop.location_text) {
        stopText += '<br/><br/>' + this.selectedStop.location_text;
      }
      const locationStopMediaItems: MediaItem[] = [
        {
          caption: '',
          embed_url: '',
          image_small: this.selectedStop.stop_image as string,
          license: this.selectedStop.stop_image_license,
          media_file: '',
          media_id: '',
          source_link: this.selectedStop.stop_image_source_link,
          source_name: this.selectedStop.stop_image_source_name,
          text: stopText,
          type: MediaItemType.Image,
          title: '',
        },
      ];
      this.selectedStop.media_items = locationStopMediaItems;
    } else {
      const retrievedMediaItems: MediaItem[] =
        await this.apiService.getMediaItemsByStoryId(this.selectedStop.stop_id);
      this.selectedStop.media_items = retrievedMediaItems;
    }
  }

  private async _updateSelectedStopMediaItemsFromLocationStories() {
    if (!this.selectedStop) {
      return;
    }

    const stopIsLocation = this.selectedStop.stop_type === 'Locatie';
    if (stopIsLocation) {
      const locationStories: Story[] =
        await this.apiService.getStoriesByLocationId(this.selectedStop.stop_id);

      for (const locationStory of locationStories) {
        this.apiService
          .getMediaItemsByStoryId(locationStory.story_id)
          .then((storyMediaItems: MediaItem[]) => {
            if (!this.selectedStop) {
              return;
            }
            if (!this.selectedStop.location_stories_and_media_items) {
              this.selectedStop.location_stories_and_media_items = [];
            }

            this.selectedStop.location_stories_and_media_items.push({
              story: locationStory,
              mediaItems: storyMediaItems,
            });
          });
      }
    }
  }

  public get selectedStop(): UtmRouteStop | undefined {
    const selectedRoute: UtmRoute | undefined = this.selected.getValue();
    if (selectedRoute === undefined || selectedRoute?.stops === undefined) {
      return undefined;
    }

    const selectedStopIdx = this.selectedStopIdx.getValue();
    if (selectedStopIdx === undefined) {
      return undefined;
    }

    return selectedRoute.stops[selectedStopIdx];
  }

  public selectedStopHasMediaItems(): boolean {
    return (
      this.selectedStop !== undefined &&
      this.selectedStop?.media_items?.length > 0
    );
  }

  public selectedStopHasLocationStories(): boolean {
    return (
      this.selectedStop !== undefined &&
      this.selectedStop.location_stories_and_media_items !== undefined &&
      this.selectedStop.location_stories_and_media_items.length > 0
    );
  }

  public async load() {
    this.all = await this.apiService.getUtmRoutes();

    console.log('Loaded all UTM routes:', this.all);
  }

  public async selectByUrlOrId(url: string, id?: string) {
    this.spinner.loadingRoute = true;

    // Check if router is already at specified url
    // If not, navigate to url - this triggers running this function again
    // through the subscription to router events
    if (this.router.url !== url) {
      await this.router.navigateByUrl(url);
      return;
    }

    if (!id) {
      const urlWithoutParams = url.split('?')[0];
      id = await this.apiService.getNidFromUrlAlias(urlWithoutParams);

      const idAlreadySelected = id === this.selected.getValue()?.nid;
      if (idAlreadySelected) {
        return;
      }
    }

    if (!this.all) {
      await this.load();
    }

    if (!url || !this.all) {
      return;
    }

    const routeToSelect: UtmRoute | undefined = this.all.find(
      (r) => r.nid === id
    );
    if (!routeToSelect) {
      console.warn('Could not find route with ID', id, this.all);
      return;
    }

    const routeStops: UtmRouteStop[] | undefined =
      await this.apiService.getUtmRouteStopsById(id);
    if (routeStops) {
      routeToSelect.stops = routeStops;
    }

    this.selected.next(routeToSelect);

    this.spinner.loadingRoute = false;
  }

  public selectStopByIdx(stopIdx: number | undefined) {
    const selectedRoute: UtmRoute | undefined = this.selected.getValue();
    const selectedStops: UtmRouteStop[] | undefined = selectedRoute?.stops;
    if (!selectedStops) {
      return;
    }

    const stopDoesNotExist =
      stopIdx !== undefined && stopIdx >= selectedStops.length;
    if (stopDoesNotExist) {
      return;
    }

    if (selectedRoute) {
      this.selectedStopIdx.next(stopIdx);

      const selectingHome = stopIdx === undefined;
      if (selectingHome && this.platform.isBrowser()) {
        window.scrollTo({ top: selectingHome ? 0 : 200, behavior: 'smooth' });
        return;
      }

      if (this.platform.isBrowser() && window.scrollY == 0) {
        // TODO: Fine-tune this value, where do we want to scroll to when selecting a new stop?
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    }
  }
}
