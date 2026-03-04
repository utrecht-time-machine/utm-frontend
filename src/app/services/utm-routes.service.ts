import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtmRoute } from '../models/utm-route';
import { ApiService } from './api.service';
import { NavigationEnd, Router } from '@angular/router';
import { UtmRouteStop } from '../models/utm-route-stop';
import { SpinnerService } from './spinner.service';
import { PlatformService } from './platform.service';
import { UtmTranslateService } from './utm-translate.service';
import { Story } from '../models/story';
import { environment } from '../../environments/environment';
import { SelectedView } from '../models/selected-view';
import { RoutingService } from './routing.service';
import { AudioCoordinatorService } from './audio-coordinator.service';
import { DebugLogService } from './debug-log.service';

@Injectable({
  providedIn: 'root',
})
export class UtmRoutesService {
  all = new BehaviorSubject<UtmRoute[]>([]);

  selected: BehaviorSubject<UtmRoute | undefined> = new BehaviorSubject<UtmRoute | undefined>(
    undefined,
  );

  selectedRouteLocationsLoaded: EventEmitter<any> = new EventEmitter<any>();

  selectedStopIdx: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(
    undefined,
  );

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: SpinnerService,
    private platform: PlatformService,
    private utmTranslate: UtmTranslateService,
    private routing: RoutingService,
    private logger: DebugLogService,
    private audioCoordinator: AudioCoordinatorService,
  ) {
    void this.load();

    this._initSelectOnRouteChange();
    this._resetStopIndexOnRouteChange();
    this._checkDevModeRouteOnRouteChange();
    this._loadStopsDataFromServerOnRouteChange();
    this._loadStoriesDataFromServerOnStopChange();
  }

  private _initSelectOnRouteChange() {
    this.router.events.subscribe(e => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }

      if (this.routing.getSelectedView() === SelectedView.SelectedRoute) {
        this.selectByUrlOrId(e.url);
      }
    });
  }

  private _checkDevModeRouteOnRouteChange() {
    this.selected.subscribe(selectedRoute => {
      if (!selectedRoute) {
        return;
      }

      if (selectedRoute.show_only_in_dev_mode && !environment.dev) {
        this.selected.next(undefined);
        this.router.navigate(['/routes']);
      }
    });
  }

  private _loadStopsDataFromServerOnRouteChange() {
    this.selected.subscribe(async selectedRoute => {
      if (!selectedRoute) {
        return;
      }

      const routeStops: UtmRouteStop[] | undefined = await this.apiService.getUtmRouteStopsById(
        selectedRoute.nid,
      );

      if (!routeStops) {
        return;
      }

      this.spinner.loadingRouteStopLocation = true;

      const loadingLocationDataPromises: Promise<void>[] = [];
      for (const routeStop of routeStops) {
        const loadingStopLocationDataPromise: Promise<void> = this.apiService
          .getLocationDetailsById(routeStop.location_id)
          .then(locationDetails => {
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
    this.selectedStopIdx.subscribe(async stopIdx => {
      let selectedStopDataIsAlreadyLoaded: boolean = this.selectedStop?.stories !== undefined;
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
          .then(async story => {
            if (stop.stories === undefined) {
              stop.stories = [];
            }

            if (story) {
              story.mediaItems = await this.apiService.getMediaItemsByStoryId(story.story_id);

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

      // Trigger change detection to update the UI
      const currentStopIdx = this.selectedStopIdx.getValue();
      this.selectedStopIdx.next(currentStopIdx);

      if (this.platform.isBrowser() && stopIdx !== undefined && window.scrollY == 0) {
        // TODO: Fine-tune this value, where do we want to scroll to when selecting a new stop?
        setTimeout(() => {
          window.scrollTo({ top: 200, behavior: 'smooth' });
        }, 100);
      }

      this.spinner.loadingRouteStopStories = false;
    });
  }
  private _resetStopIndexOnRouteChange() {
    this.selected.subscribe(() => {
      this.selectedStopIdx.next(undefined);
    });
  }

  public get shown(): UtmRoute[] {
    if (!this.all.value) {
      return [];
    }
    if (environment.dev) {
      return this.all.value;
    }
    return this.all.value.filter((route: UtmRoute) => !route.show_only_in_dev_mode);
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
    const routes = await this.apiService.getUtmRoutes();
    this.all.next(routes);

    if (this.platform.isBrowser()) {
      console.log('Loaded all UTM routes:', this.all.value);
    }
  }

  public async selectById(id: string): Promise<void> {
    // TODO: Sometimes a route is selected from this.all that is not (yet?) translated
    if (!this.all) {
      return;
    }

    const routeToSelect: UtmRoute | undefined = this.all.value.find(r => r.nid === id);
    if (!routeToSelect) {
      console.warn('Could not find route with ID', id, this.all.value);
      this.spinner.loadingRoute = false;
      return;
    }

    this.selected.next(routeToSelect);

    if (this.platform.isBrowser()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.spinner.loadingRoute = false;
  }

  public async navigateToRouteStop(routeId: string, stopIdx: number | undefined): Promise<void> {
    if (!this.all.value.length) {
      await this.load();
    }

    const route: UtmRoute | undefined = this.all.value.find(r => r.nid === routeId);
    if (!route) {
      console.error('Could not find route with ID', routeId);
      return;
    }

    await this.selectByUrlOrId(route.url);

    // TODO: Properly wait for route selection to finish
    await new Promise(resolve => setTimeout(resolve, 200));

    const selectedRoute = this.selected.getValue();
    if (!selectedRoute) {
      console.error('No route selected after navigation');
      return;
    }

    const stopsLoaded = !!selectedRoute.stops?.length;
    if (!stopsLoaded) {
      const routeLocationsLoadedPromise = new Promise<void>(resolve => {
        const sub = this.selectedRouteLocationsLoaded.subscribe(() => {
          sub.unsubscribe();
          resolve();
        });
      });
      await routeLocationsLoadedPromise;
    }
    // TODO: Properly wait for stops loading to finish
    await new Promise(resolve => setTimeout(resolve, 100));

    this.selectStopByIdx(stopIdx, 200, true);
  }

  private _justRedirected = false;

  public async selectByUrlOrId(url: string, id?: string) {
    this.spinner.loadingRoute = true;

    if (this._justRedirected) {
      // We just redirected, so don't do it again
      this._justRedirected = false;
      url = this.router.url;
      console.log(
        'Skipping redirect due to justRedirected flag, assuming we are in the right place:',
        this.router.url,
        url,
      );
    } else if (this.router.url !== url) {
      // If not there already, navigate to url - this triggers running this function again
      // through the subscription to router events
      console.log('URL is not yet what it should be, redirecting:', this.router.url, url);

      this._justRedirected = true;
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

    if (!this.all.value.length) {
      await this.load();
    }

    if (!url || !this.all.value) {
      this.spinner.loadingRoute = false;
      return;
    }

    await this.selectById(id);
  }

  public selectStopByIdx(
    stopIdx: number | undefined,
    scrollTo: number | undefined = 200,
    autoPlay = false,
  ) {
    this.logger.log('UtmRoutesService', 'selectStopByIdx', { stopIdx, autoPlay });
    const selectedRoute: UtmRoute | undefined = this.selected.getValue();
    const selectedStops: UtmRouteStop[] | undefined = selectedRoute?.stops;

    if (!selectedStops) {
      return;
    }

    const stopDoesNotExist = stopIdx !== undefined && stopIdx >= selectedStops.length;
    if (stopDoesNotExist) {
      return;
    }

    if (selectedRoute) {
      if (autoPlay) {
        this.audioCoordinator.requestAutoPlay();
      }
      this.selectedStopIdx.next(stopIdx);

      const selectingHome = stopIdx === undefined;
      if (this.platform.isBrowser()) {
        setTimeout(() => {
          window.scrollTo({ top: selectingHome ? 0 : scrollTo, behavior: 'smooth' });
        });
        return;
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
