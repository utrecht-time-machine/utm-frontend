import { Injectable } from '@angular/core';
import mapboxgl, {
  LngLat,
  LngLatBounds,
  LngLatLike,
  Map,
  Popup,
} from 'mapbox-gl';
import { ApiService } from './api.service';
import { GeoJSON } from 'geojson';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { MapLocation } from '../models/map-location';
import { LocationDistanceFromCenter } from '../models/location-distance-from-center';
import { NavigationEnd, Router } from '@angular/router';
import { LocationDetails } from '../models/location-details';
import { UtilService } from './util.service';
import { RoutingService } from './routing.service';
import { SelectedView } from '../models/selected-view';
import { UtmRoutesService } from './utm-routes.service';
import { UtmRouteStop } from '../models/utm-route-stop';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtmTranslateService } from './utm-translate.service';
import { SpinnerService } from './spinner.service';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: mapboxgl.Map | undefined = undefined;
  allLocations: BehaviorSubject<MapLocation[]> = new BehaviorSubject<
    MapLocation[]
  >([]);

  shownLocationPopup: Popup | undefined = undefined;
  shownStopPopup: Popup | undefined = undefined;

  mapLocationsFeatures: GeoJSON.FeatureCollection | undefined = undefined;

  selectedLocation: BehaviorSubject<LocationDetails | undefined> =
    new BehaviorSubject<LocationDetails | undefined>(undefined);

  locationsClosestToCenter = new BehaviorSubject<LocationDistanceFromCenter[]>(
    []
  );

  constructor(
    private apiService: ApiService,
    private utmRoutes: UtmRoutesService,
    private router: Router,
    private routing: RoutingService,
    private http: HttpClient,
    private utmTranslate: UtmTranslateService,
    private spinner: SpinnerService,
    private platform: PlatformService
  ) {
    this.router.events.subscribe((e) => {
      if (!(e instanceof NavigationEnd)) {
        return;
      }
      const loadedLocationsPage =
        this.routing.getSelectedView() === SelectedView.Locations;
      if (loadedLocationsPage) {
        const loadedHomePage = this.router.url === '/';
        if (loadedHomePage) {
          void this.deselectLocation();
        } else {
          void this.selectLocationByUrlOrId(this.router.url);
        }
      } else {
        void this.deselectLocation();
      }

      const loadedRoutePage =
        this.routing.getSelectedView() === SelectedView.SelectedRoute;
      if (!loadedRoutePage) {
        this.removeRouteMarkersFromMap();
        this.utmRoutes.selected.next(undefined);
      }
    });

    this.locationsClosestToCenter.subscribe(() => {
      console.log(
        'Locations closest to center updated:',
        this.locationsClosestToCenter.getValue()
      );

      this.locationsClosestToCenter.getValue().map((locationCloseToCenter) => {
        this.utmTranslate.translateObjectByKeys(
          locationCloseToCenter.location,
          environment.translateKeys.mapLocation
        );
      });
    });

    this.utmRoutes.selected.subscribe(() => {
      setTimeout(() => {
        void this.addRouteMarkersOnMap();
      });
    });

    this.utmRoutes.selectedStopIdx.subscribe((stopIdx) => {
      if (!this.map || stopIdx === undefined) {
        return;
      }

      if (!this.utmRoutes.selectedStop) {
        this.fitMapToRouteBounds();
      }

      const selectedStop: UtmRouteStop | undefined =
        this.utmRoutes.selectedStop;
      if (!selectedStop) {
        return;
      }

      const stopCoords = selectedStop.coords;
      if (stopCoords) {
        this.map.flyTo({
          center: [stopCoords.lng, stopCoords.lat],
          essential: true,
          zoom: 18,
        });

        this._showMapStopPopup(
          stopCoords,
          selectedStop.title,
          selectedStop.address,
          selectedStop.stop_thumb,
          stopIdx
        );
      }
    });
  }

  initMap() {
    // setTimeout(() => {
    //   this.showSpinner = true;
    // });

    this.removeRouteMarkersFromMap();

    mapboxgl.accessToken = environment.mapboxAccessToken;

    const maxRandomXOffset = 0.002222;
    const maxRandomYOffset = 0.000833;
    const randomCenter: LngLatLike = [
      5.12 + Math.random() * maxRandomXOffset,
      52.09 + Math.random() * maxRandomYOffset,
    ]; //[5.122222, 52.090833];
    this.map = new mapboxgl.Map({
      container: 'mapbox',
      // style: 'mapbox://styles/mapbox/streets-v12',
      // style: 'mapbox://styles/mapbox/navigation-night-v1',
      // style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/light-v11',
      center: randomCenter,
      zoom: 16,
      pitch: 45, //24
      bearing: 0,
      attributionControl: false,
      // @ts-ignore
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [
            'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
          ],
          tileSize: 256,
          attribution:
            'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
        },
      },
    });

    const nav = new mapboxgl.NavigationControl({
      showCompass: false,
    });
    this.map.addControl(nav, 'top-right');
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserHeading: true,
        showUserLocation: true,
      })
    );
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.map.on('click', () => {
      this.map?.scrollZoom.enable();
    });
    this.map.on('movestart', () => {
      this.map?.scrollZoom.enable();
    });
    this.map.on('touchstart', () => {
      this.map?.scrollZoom.enable();
    });

    this.map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = this.map?.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      )?.id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      this.map?.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      if (this.routing.getSelectedView() === SelectedView.Locations) {
        this.addLocationsOnMap(false);
      } else if (
        this.routing.getSelectedView() === SelectedView.SelectedRoute
      ) {
        void this.addRouteMarkersOnMap();
        this.addLocationsOnMap(true);
      }

      // setTimeout(() => {
      //   this.showSpinner = false;
      // });
    });
  }

  getBoundingBoxByCoordinates(coordinates: LngLat[]): LngLatBounds {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    coordinates.forEach((coordinate: LngLat) => {
      const lng = coordinate.lng;
      const lat = coordinate.lat;

      if (lng < minX) {
        minX = lng;
      }
      if (lat < minY) {
        minY = lat;
      }
      if (lng > maxX) {
        maxX = lng;
      }
      if (lat > maxY) {
        maxY = lat;
      }
    });

    const boundingBox = new LngLatBounds([minX, minY], [maxX, maxY]);
    return boundingBox;
  }

  async addRouteMarkersOnMap() {
    if (!this.map) {
      return;
    }

    this.removeRouteMarkersFromMap();

    const routeStops: UtmRouteStop[] | undefined =
      this.utmRoutes.selected.getValue()?.stops;
    if (!routeStops) {
      // console.warn('Could not find route stops');
      return;
    }

    const stopsFeatureCollection = {
      type: 'FeatureCollection',
      features: routeStops.map((stop, idx) => {
        if (!stop || !stop.coords) {
          return {};
        }
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [stop.coords.lng, stop.coords.lat],
          },
          properties: {
            label: idx + 1,
            stop_title: stop.title,
            stop_address: stop.address,
            stop_thumb: stop.stop_thumb,
            idx: idx,
          },
        };
      }),
    };

    const routePath = await this._getRouteStopsPathFeature(routeStops);
    if (!this.map) {
      return;
    }

    this.map.addSource('route_path', routePath);

    this.map.addLayer({
      id: 'route_line',
      type: 'line',
      source: 'route_path',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#fe0000',
        'line-width': 4,
      },
    });

    this.map.addSource('stops', {
      type: 'geojson',
      data: stopsFeatureCollection as any,
    });

    this.map.addLayer({
      id: 'stops-marker',
      type: 'circle',
      source: 'stops',
      paint: {
        'circle-color': '#fe0000',
        'circle-radius': 10,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    this.map.addLayer({
      id: 'stops-marker-labels',
      type: 'symbol',
      source: 'stops',
      layout: {
        'text-field': '{label}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-offset': [0, 0],
        // 'text-anchor': 'top',
      },
      paint: {
        'text-color': '#ffffff',
      },
    });

    this.map.on('mouseenter', 'stops-marker', () => {
      if (this.map) {
        this.map.getCanvas().style.cursor = 'pointer';
      }
    });
    this.map.on('mouseleave', 'stops-marker', () => {
      if (this.map) {
        this.map.getCanvas().style.cursor = '';
      }
    });
    this.map.on('click', 'stops-marker', (e: any) => {
      if (!this.map) {
        return;
      }

      const feature = e.features[0];
      const coords: LngLatLike = {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      };
      this._showMapStopPopup(
        coords,
        feature.properties.stop_title,
        feature.properties.stop_address,
        feature.properties.stop_thumb,
        feature.properties.idx
      );
    });

    this.fitMapToRouteBounds();
  }

  fitMapToRouteBounds() {
    if (!this.map || !this.utmRoutes.selected.getValue()?.stops) {
      return;
    }

    const stopsCoordinates: LngLat[] | undefined = this.utmRoutes.selected
      .getValue()
      ?.stops?.map((stop) => {
        return new LngLat(stop.coords.lng, stop.coords.lat);
      });

    if (stopsCoordinates) {
      const stopsBounds: LngLatBounds =
        this.getBoundingBoxByCoordinates(stopsCoordinates);

      this.map.fitBounds(stopsBounds, {
        padding: 100,
        duration: 2000,
      });
    }
  }

  removeRouteMarkersFromMap() {
    if (!this.map) {
      return;
    }

    const stopsLayer = this.map.getLayer('stops-marker');
    if (stopsLayer) {
      this.map.removeLayer('stops-marker');
    }

    const stopsLabelsLayer = this.map.getLayer('stops-marker-labels');
    if (stopsLabelsLayer) {
      this.map.removeLayer('stops-marker-labels');
    }

    const stopsSource = this.map.getSource('stops');
    if (stopsSource) {
      this.map.removeSource('stops');
    }

    const routeLineLayer = this.map.getLayer('route_line');
    if (routeLineLayer) {
      this.map.removeLayer('route_line');
    }

    const routePathSource = this.map.getSource('route_path');
    if (routePathSource) {
      this.map.removeSource('route_path');
    }
  }

  async updateAllLocationsFromServer() {
    this.allLocations.next(
      await lastValueFrom(this.apiService.getMapLocations())
        .catch((err) => {
          console.error(err);
          return [];
        })
        .then((locations) => {
          if (!locations || !locations.length) {
            console.error('No locations found in database');
          }
          return locations;
        })
    );
  }

  addLocationsOnMap(hideLocations = false) {
    if (!this.map) {
      console.warn('Map not yet initialized... Not adding locations to map.');
      return;
    }

    this.map.on('load', async () => {
      if (!hideLocations) {
        setTimeout(() => (this.spinner.loadingLocations = true));
      }

      await this.updateAllLocationsFromServer();

      this.mapLocationsFeatures = this.apiService.convertMapLocationsToGeoJson(
        this.allLocations.getValue()
      );

      if (!this.mapLocationsFeatures) {
        console.warn('No map locations loaded...');
        return;
      }

      console.log('Adding map locations: ', this.mapLocationsFeatures);

      this.map?.addSource('locations', {
        type: 'geojson',
        data: this.mapLocationsFeatures,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });
      this.map?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'locations',
        filter: ['has', 'point_count'],
        paint: {
          // 'circle-color': ['step', ['get', 'point_count'], '#ffffff', 80, '#fe0000', 200, '#fe0000'],
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#ffffff',
            80,
            '#ffffff',
            200,
            '#ffffff',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            80,
            36,
            200,
            36,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fe0000',
        },
      });
      this.map?.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });
      this.map?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'locations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#fe0000',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      if (hideLocations) {
        this.hideLocationsOnMap();
      }

      this._initMapInteractivity();

      setTimeout(() => (this.spinner.loadingLocations = false));
    });
  }

  hideLocationsOnMap() {
    if (!this.map) {
      return;
    }

    this.map.setLayoutProperty('clusters', 'visibility', 'none');
    this.map.setLayoutProperty('cluster-count', 'visibility', 'none');
    this.map.setLayoutProperty('unclustered-point', 'visibility', 'none');
  }

  updateLocationsClosestToCenter(maxItems: number = 5): void {
    if (!this.map || !this.mapLocationsFeatures) {
      console.warn('Map not (yet) initialized...');
      return;
    }

    // TODO: Also check if in bounds?

    const center = this.map.getCenter();
    let locationsWithDistances: LocationDistanceFromCenter[] =
      this.mapLocationsFeatures.features
        .map((feature: any) => {
          const [lng, lat] = feature.geometry.coordinates;
          const distance = UtilService.getDistanceFromLatLonInKm(
            center.lat,
            center.lng,
            lat,
            lng
          );
          const location: MapLocation = feature?.properties;
          return { location, distanceFromCenterInKm: distance };
        })
        .filter((item: any) => {
          const locationIsSelected: boolean =
            this.selectedLocation.getValue()?.nid ===
            item.location.nid.toString();
          const locationIsSelectedAsStop =
            this.utmRoutes.selectedStop?.stop_id ===
            item.location.nid.toString();
          return (
            !isNaN(item.distanceFromCenterInKm) &&
            !locationIsSelected &&
            !locationIsSelectedAsStop
          );
        });
    locationsWithDistances.sort(
      (a, b) => a.distanceFromCenterInKm - b.distanceFromCenterInKm
    );
    locationsWithDistances = locationsWithDistances.slice(0, maxItems);
    this.locationsClosestToCenter.next(locationsWithDistances);
  }

  deselectLocation() {
    this.selectedLocation.next(undefined);
  }

  async selectLocationByUrlOrId(url: string, locationId?: string) {
    // Check if router is already at specified url
    // If not, navigate to url - this triggers running this function again
    // through the subscription to router events
    if (this.router.url !== url) {
      await this.router.navigateByUrl(url);
      return;
    }

    const urlWithoutParams = url.split('?')[0];
    const locationIsAlreadySelected =
      urlWithoutParams === this.selectedLocation.getValue()?.url;
    if (locationIsAlreadySelected) {
      return;
    }

    setTimeout(() => (this.spinner.loadingLocation = true));
    if (!locationId) {
      const urlWithoutParams = url.split('?')[0];
      locationId = await this.apiService.getNidFromUrlAlias(urlWithoutParams);
    }

    const locationDetails: LocationDetails | undefined =
      await this.apiService.getLocationDetailsById(locationId);
    if (locationDetails) {
      this.selectedLocation.next(locationDetails);
      this._showMapLocationPopup(locationDetails);
    }

    setTimeout(async () => {
      if (!this.map || !locationDetails) {
        return;
      }

      console.log(
        `Flying to coordinates of ${locationDetails.title}: ${JSON.stringify(
          locationDetails.coords
        )}...`
      );

      this.map.flyTo({
        center: [locationDetails.coords.long, locationDetails.coords.lat],
        essential: true,
        zoom: 18,
      });

      // TODO: Fine-tune this value, where do we want to scroll to when selecting a new location?
      // const headerHeight: number =
      //   document.getElementsByClassName('utm-header')[0].clientHeight;

      if (this.platform.isBrowser()) {
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }

      setTimeout(() => (this.spinner.loadingLocation = false));
    });
  }

  private _initMapInteractivity() {
    this.map?.on('click', 'clusters', (e: any) => {
      const features = this.map?.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      // @ts-ignore
      const clusterId = features[0].properties.cluster_id;
      this.map
        ?.getSource('locations')
        // @ts-ignore
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          this.map?.easeTo({
            // @ts-ignore
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });
    this.map?.on('mouseenter', 'clusters', () => {
      (this.map as Map).getCanvas().style.cursor = 'pointer';
    });
    this.map?.on('mouseenter', 'unclustered-point', () => {
      (this.map as Map).getCanvas().style.cursor = 'pointer';
    });
    this.map?.on('mouseleave', 'clusters', () => {
      (this.map as Map).getCanvas().style.cursor = '';
    });
    this.map?.on('mouseleave', 'unclustered-point', () => {
      (this.map as Map).getCanvas().style.cursor = '';
    });
    this.map?.on('click', 'unclustered-point', (e: any) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const locationDetails: LocationDetails = {
          nid: feature.properties.nid,
          geo: feature.properties.geo,
          address: feature.properties.address,
          city: feature.properties.city,
          coords: {
            lat: feature.geometry.coordinates[1],
            long: feature.geometry.coordinates[0],
          },
          thumb: feature.properties.thumb,
          title: feature.properties.title,
          url: feature.properties.url,
        };
        this._showMapLocationPopup(locationDetails);
      }
    });

    this.map?.on('moveend', () => {
      this.updateLocationsClosestToCenter(5);
    });
    this.map?.on('zoomend', () => {
      this.updateLocationsClosestToCenter(5);
    });

    this.updateLocationsClosestToCenter(5);
  }

  private _initStopPopupClicking(popup: Popup) {
    const link = popup.getElement()?.querySelector('.popup-stop-link');
    if (link) {
      link.addEventListener('click', (event: any) => {
        event.preventDefault();
        const stopIdx = link.getAttribute('data-stop-idx');
        if (stopIdx) {
          void this.utmRoutes.selectStopByIdx(parseInt(stopIdx));
        } else {
          console.warn('Clicked on popup route stop without a known index...');
        }
      });
    }
  }

  private _initLocationPopupClicking(popup: Popup, nid: string) {
    // Catch popup clicks and route them to the Angular routing service
    const link = popup.getElement()?.querySelector('.popup-location-link');
    if (link) {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const url = link.getAttribute('data-url');
        if (url) {
          void this.selectLocationByUrlOrId(url, nid);
        } else {
          console.warn('Clicked on popup location without a URL...');
        }
      });
    }
  }

  private _getStopPopupHtml(
    title: string,
    address: string,
    thumb: string,
    idx: number
  ): string {
    return `
    <a data-stop-idx="${idx}" class="popup-stop-link">
      <div>
        <div>
          <div class="thumb">
              <img src="${thumb}">
          </div>
        </div>
        <div>
          <span class="name">${title}</span>
          <span class="addr">${address}</span>
        </div>
      </div>
    </a>`;
  }

  private _getLocationPopupHtml(location: LocationDetails): string {
    return `
      <a data-url="${location.url}" class="popup-location-link">
        <div>
          <div>
            <div class="thumb">
                <img src="${location.thumb}">
            </div>
          </div>
          <div>
            <span class="name">${location.title}</span>
            <span class="addr">${location.address} ${location.city}</span>
          </div>
        </div>
      </a>`;
  }

  private async _showMapLocationPopup(location: LocationDetails) {
    if (this.shownLocationPopup) {
      this.shownLocationPopup.remove();
      this.shownLocationPopup = undefined;
    }

    const popup: Popup = new mapboxgl.Popup({
      offset: [0, 0],
    })
      .setHTML(this._getLocationPopupHtml(location))
      .setLngLat([location.coords.long, location.coords.lat])
      .addTo(this.map as mapboxgl.Map);

    this.utmTranslate
      .translateObjectByKeys(location, environment.translateKeys.mapLocation)
      .then(() => {
        popup.setHTML(this._getLocationPopupHtml(location));
        this._initLocationPopupClicking(popup, location.nid);
      });

    this._initLocationPopupClicking(popup, location.nid);

    this.shownLocationPopup = popup;
  }

  private async _showMapStopPopup(
    coords: LngLatLike,
    title: string,
    address: string,
    thumb: string,
    idx: number
  ) {
    if (this.shownStopPopup) {
      this.shownStopPopup.remove();
      this.shownStopPopup = undefined;
    }

    const popup: Popup = new mapboxgl.Popup({
      offset: [0, 0],
    })
      .setHTML(this._getStopPopupHtml(title, address, thumb, idx))
      .setLngLat(coords)
      .addTo(this.map as mapboxgl.Map);

    this.utmTranslate
      .translateObjectByKeys(stop, environment.translateKeys.mapLocation)
      .then(() => {
        popup.setHTML(this._getStopPopupHtml(title, address, thumb, idx));
        this._initStopPopupClicking(popup);
      });

    this._initStopPopupClicking(popup);

    this.shownStopPopup = popup;
  }

  private async _getRouteStopsPathFeature(
    routeStops: UtmRouteStop[]
  ): Promise<any> {
    const coordsStr: string = routeStops
      .map((stop) => {
        if (stop.coords) {
          return `${stop.coords.lng},${stop.coords.lat}`;
        }
        return undefined;
      })
      .join(';');

    const stopsPathFeature: any = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    };
    if (!coordsStr) {
      return stopsPathFeature;
    }

    const directionsRequest =
      `https://api.mapbox.com/directions/v5/mapbox/walking/${coordsStr}` +
      '?continue_straight=true&geometries=geojson&overview=full&access_token=' +
      environment.mapboxAccessToken;

    console.log(directionsRequest);
    const directionsData: any = await lastValueFrom(
      this.http.get(directionsRequest)
    );

    let coordinates = [];
    if (directionsData.routes.length > 0) {
      coordinates = directionsData.routes[0].geometry.coordinates;
    }
    stopsPathFeature.data.geometry.coordinates = coordinates;
    return stopsPathFeature;
  }
}
