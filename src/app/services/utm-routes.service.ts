import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';
import { SpinnerService } from './spinner.service';
import { PlatformService } from './platform.service';

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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: SpinnerService,
    private platform: PlatformService
  ) {
    void this.load();

    this._resetStopIndexOnRouteChange();
    this._loadStopsDataFromServerOnRouteChange();
    this._loadStopDataFromServerOnStopChange();
  }

  private _loadStopsDataFromServerOnRouteChange() {
    this.selected.subscribe(async (selectedRoute) => {
      if (!selectedRoute) {
        return;
      }

      const routeStops: UtmRouteStop[] | undefined =
        await this.apiService.getUtmRouteStopsById(selectedRoute.nid);

      if (!routeStops) {
        return;
      }

      selectedRoute.stops = routeStops;
    });
  }

  private _loadStopDataFromServerOnStopChange() {
    this.selectedStopIdx.subscribe(() => {
      const selectedStopDataIsAlreadyLoaded = this.selectedStop?.location;
      if (!this.selectedStop || selectedStopDataIsAlreadyLoaded) {
        return;
      }

      const stop = this.selectedStop;

      this.spinner.loadingRouteStopLocation = true;
      this.apiService
        .getLocationDetailsById(stop.location_id)
        .then((locationDetails) => {
          stop.location = locationDetails;
          this.spinner.loadingRouteStopLocation = false;
        });

      if (!stop.story_ids) {
        return;
      }

      // TODO: Wait until all story details requests have finished to show/hide spinner
      for (const storyId of stop.story_ids.split(',')) {
        this.apiService.getStoryDetailsById(storyId).then(async (story) => {
          if (!stop.stories) {
            stop.stories = [];
          }

          if (story) {
            story.mediaItems = await this.apiService.getMediaItemsByStoryId(
              story.story_id
            );
            stop.stories.push(story);
          }
        });
      }
    });
  }
  private _resetStopIndexOnRouteChange() {
    this.selected.subscribe(() => {
      this.selectedStopIdx.next(undefined);
    });
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

  public async load() {
    this.all = await this.apiService.getUtmRoutes();

    console.log('Loaded all UTM routes:', this.all);
  }

  public async selectById(id: string): Promise<void> {
    // TODO: Sometimes a route is selected from this.all that is not (yet?) translated
    if (!this.all) {
      return;
    }

    const routeToSelect: UtmRoute | undefined = this.all.find(
      (r) => r.nid === id
    );
    if (!routeToSelect) {
      console.warn('Could not find route with ID', id, this.all);
      this.spinner.loadingRoute = false;
      return;
    }

    this.selected.next(routeToSelect);

    this.spinner.loadingRoute = false;
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
        this.spinner.loadingRoute = false;
        return;
      }
    }

    if (!this.all) {
      await this.load();
    }

    if (!url || !this.all) {
      this.spinner.loadingRoute = false;
      return;
    }

    await this.selectById(id);
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
