import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';
import { SpinnerService } from './spinner.service';
import { PlatformService } from './platform.service';
import { UtmTranslateService } from './utm-translate.service';
import { Story } from '../models/story';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtmRoutesService {
  all: UtmRoute[] | undefined = undefined;

  selected: BehaviorSubject<UtmRoute | undefined> = new BehaviorSubject<
    UtmRoute | undefined
  >(undefined);

  selectedRouteLocationsLoaded: EventEmitter<any> = new EventEmitter<any>();

  selectedStopIdx: BehaviorSubject<number | undefined> = new BehaviorSubject<
    number | undefined
  >(undefined);

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: SpinnerService,
    private platform: PlatformService,
    private utmTranslate: UtmTranslateService
  ) {
    void this.load();

    this._resetStopIndexOnRouteChange();
    this._loadStopsDataFromServerOnRouteChange();
    this._loadStoriesDataFromServerOnStopChange();
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

      this.spinner.loadingRouteStopLocation = true;

      const loadingLocationDataPromises: Promise<void>[] = [];
      for (const routeStop of routeStops) {
        const loadingStopLocationDataPromise: Promise<void> = this.apiService
          .getLocationDetailsById(routeStop.location_id)
          .then((locationDetails) => {
            routeStop.location = locationDetails;

            if (routeStop.show_location_info && locationDetails !== undefined) {
              const locationAsStory: Story =
                this.apiService.convertLocationDetailsToStory(locationDetails);

              if (routeStop.stories === undefined) {
                routeStop.stories = [];
              }
              routeStop.stories.push(locationAsStory);
            }
          });
        loadingLocationDataPromises.push(loadingStopLocationDataPromise);
      }

      selectedRoute.stops = routeStops;

      await Promise.all(loadingLocationDataPromises);
      this.spinner.loadingRouteStopLocation = false;

      this.selectedRouteLocationsLoaded.emit();
    });
  }

  private _loadStoriesDataFromServerOnStopChange() {
    this.selectedStopIdx.subscribe(async () => {
      let selectedStopDataIsAlreadyLoaded: boolean =
        this.selectedStop?.stories !== undefined;
      if (
        this.selectedStop?.show_location_info &&
        this.selectedStop?.stories &&
        this.selectedStop.stories.length <= 1
      ) {
        selectedStopDataIsAlreadyLoaded = false;
      }

      if (!this.selectedStop || selectedStopDataIsAlreadyLoaded) {
        return;
      }

      const stop = this.selectedStop;

      if (!stop.story_ids) {
        return;
      }

      this.spinner.loadingRouteStopStories = true;

      const loadingStoryDetailsPromises: Promise<void>[] = [];
      for (const storyId of stop.story_ids.split(',')) {
        const loadingStoryDetailsPromise: Promise<void> = this.apiService
          .getStoryDetailsById(storyId)
          .then(async (story) => {
            if (stop.stories === undefined) {
              stop.stories = [];
            }

            if (story) {
              story.mediaItems = await this.apiService.getMediaItemsByStoryId(
                story.story_id
              );

              stop.stories.push(story);
            }
          });

        loadingStoryDetailsPromises.push(loadingStoryDetailsPromise);
      }

      await Promise.all(loadingStoryDetailsPromises);

      // Sort on original order of story IDs after async loading
      stop.stories?.sort((a, b) => {
        const indexA = stop.story_ids.indexOf(a.story_id);
        const indexB = stop.story_ids.indexOf(b.story_id);
        return indexA - indexB;
      });

      this.spinner.loadingRouteStopStories = false;
    });
  }
  private _resetStopIndexOnRouteChange() {
    this.selected.subscribe(() => {
      this.selectedStopIdx.next(undefined);
    });
  }

  public get shown(): UtmRoute[] {
    if (!this.all) {
      return [];
    }
    if (environment.dev) {
      return this.all;
    }
    return this.all.filter((route: UtmRoute) => !route.show_only_in_dev_mode);
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

  public selectStopByIdx(
    stopIdx: number | undefined,
    scrollTo: number | undefined = undefined
  ) {
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
        setTimeout(() => {
          window.scrollTo({ top: selectingHome ? 0 : 200, behavior: 'smooth' });
        });
        return;
      }

      if (
        this.platform.isBrowser() &&
        (window.scrollY == 0 || scrollTo !== undefined)
      ) {
        // TODO: Fine-tune this value, where do we want to scroll to when selecting a new stop?
        setTimeout(() => {
          window.scrollTo({ top: scrollTo ?? 200, behavior: 'smooth' });
        });
      }
    }
  }

  public hasNextStop(): boolean {
    const stopIdx: number | undefined = this.selectedStopIdx.getValue();

    if (stopIdx !== undefined) {
      const nextStopIdx: number = stopIdx + 1;
      const numStops = this.selected.getValue()?.stops?.length;
      if (numStops !== undefined && nextStopIdx < numStops) {
        return true;
      }
    }

    return false;
  }

  public selectNextStop(scrollTo: number | undefined = undefined) {
    const stopIdx: number | undefined = this.selectedStopIdx.getValue();

    if (stopIdx !== undefined) {
      if (this.hasNextStop()) {
        this.selectStopByIdx(stopIdx + 1, scrollTo);
      }
    }
  }
}
