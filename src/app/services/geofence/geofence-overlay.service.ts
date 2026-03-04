import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { circle as turfCircle } from '@turf/turf';
import type { Feature, FeatureCollection, Polygon } from 'geojson';

import { GeofenceService } from './geofence.service';
import { UtmRoutesService } from '../utm-routes.service';
import {
  WALKING_PROXIMITY_RADIUS_METERS,
  CYCLING_PROXIMITY_RADIUS_METERS,
} from './geofence.constants';

interface OverlayStop {
  lat: number;
  lng: number;
  stopIdx: number;
  stopTitle: string;
  notified: boolean;
  inside: boolean;
}

type GeofenceOverlayProperties = {
  identifier?: string;
  radius: number;
};

@Injectable({
  providedIn: 'root',
})
export class GeofenceOverlayService {
  private map: mapboxgl.Map | undefined;
  private sub: Subscription | undefined;

  private visible = false;
  private stops: OverlayStop[] = [];

  private readonly sourceId = 'utm-active-geofences';
  private readonly fillLayerId = 'utm-active-geofences-fill';
  private readonly lineLayerId = 'utm-active-geofences-line';

  constructor(private geofences: GeofenceService, private utmRoutes: UtmRoutesService) {}

  attach(map: mapboxgl.Map): void {
    this.map = map;

    if (!this.sub) {
      this.sub = this.geofences.state$.subscribe(state => {
        const visible = Boolean(state.enabled && state.locationPermissionOk);
        this.visible = visible;
        this.stops = state.trackedStops;
        this.updateOverlay(visible ? state.trackedStops : []);
      });
    }

    // Style reload wipes sources/layers, so re-apply current state whenever attach is called.
    this.updateOverlay(this.visible ? this.stops : []);
  }

  detach(): void {
    this.removeOverlay();
    this.map = undefined;
  }

  dispose(): void {
    this.detach();
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  private updateOverlay(stops: OverlayStop[]): void {
    const map = this.map;
    if (!map) {
      return;
    }

    if (!stops?.length) {
      this.removeOverlay();
      return;
    }

    const data = this.buildGeoJson(stops);

    const existing = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource | undefined;

    const beforeLayerId =
      map.getLayer('stops-marker')?.id ??
      map.getLayer('clusters')?.id ??
      map.getLayer('unclustered-point')?.id;

    if (!existing) {
      map.addSource(this.sourceId, {
        type: 'geojson',
        data,
      });

      map.addLayer(
        {
          id: this.fillLayerId,
          type: 'fill',
          source: this.sourceId,
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'fill-color': '#00bcd4',
            'fill-opacity': 0.18,
          },
        },
        beforeLayerId,
      );

      map.addLayer(
        {
          id: this.lineLayerId,
          type: 'line',
          source: this.sourceId,
          filter: ['==', ['geometry-type'], 'Polygon'],
          paint: {
            'line-color': '#00bcd4',
            'line-width': 2,
          },
        },
        beforeLayerId,
      );
    } else {
      existing.setData(data);
    }
  }

  private removeOverlay(): void {
    const map = this.map;
    if (!map) {
      return;
    }
    if (map.getLayer(this.lineLayerId)) {
      map.removeLayer(this.lineLayerId);
    }
    if (map.getLayer(this.fillLayerId)) {
      map.removeLayer(this.fillLayerId);
    }
    if (map.getSource(this.sourceId)) {
      map.removeSource(this.sourceId);
    }
  }

  private buildGeoJson(
    stops: OverlayStop[],
  ): FeatureCollection<Polygon, GeofenceOverlayProperties> {
    const features: Array<Feature<Polygon, GeofenceOverlayProperties>> = [];

    const isCycling = this.utmRoutes.isCurrentRouteCycling;
    const proximityRadius = isCycling
      ? CYCLING_PROXIMITY_RADIUS_METERS
      : WALKING_PROXIMITY_RADIUS_METERS;

    for (const s of stops) {
      const properties: GeofenceOverlayProperties = {
        identifier: `stop-${s.stopIdx}`,
        radius: proximityRadius,
      };

      const circlePoly: Feature<Polygon, GeofenceOverlayProperties> = turfCircle(
        [s.lng, s.lat],
        proximityRadius / 1000,
        {
          steps: 64,
          units: 'kilometers',
          properties,
        },
      );

      features.push(circlePoly);
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
