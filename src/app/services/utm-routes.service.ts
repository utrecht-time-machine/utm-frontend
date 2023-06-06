import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';
import { MediaItem, MediaItemType } from '../models/media-item';
import { SpinnerService } from './spinner.service';

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
    private spinner: SpinnerService
  ) {
    void this.load();

    this.selectedStopIdx.subscribe(() => {
      void this._updateSelectedStopMediaItems();
    });
  }

  private async _updateSelectedStopMediaItems() {
    if (!this.selectedStop) {
      return;
    }

    const stopIsLocation = this.selectedStop.stop_type === 'Locatie';
    if (stopIsLocation) {
      const locationStopMediaItems: MediaItem[] = [
        {
          caption: '',
          embed_url: '',
          image_small: this.selectedStop.stop_image as string,
          license: '',
          media_file: '',
          media_id: '',
          source_link: '',
          source_name: '',
          text: this.selectedStop.location_teaser as string,
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
      this.selectedStop?.media_items.length > 0
    );
  }

  public async load() {
    this.all = await this.apiService.getUtmRoutes();

    console.log('Loaded all UTM routes:', this.all);
  }

  public async selectByUrlOrId(url: string, id?: string) {
    this.spinner.loadingRoute = true;

    await this.router.navigateByUrl(url);

    if (!id) {
      id = await this.apiService.getNidFromUrlAlias(url);

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

      if (window.scrollY == 0) {
        // TODO: Fine-tune this value, where do we want to scroll to when selecting a new stop?
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    }
  }
}
