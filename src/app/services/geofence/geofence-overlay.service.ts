import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { circle as turfCircle } from '@turf/turf';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Geofence as BgGeofence } from 'cordova-background-geolocation-lt';

import { GeofenceService } from './geofence.service';

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
  private fences: BgGeofence[] = [];

  private readonly sourceId = 'utm-active-geofences';
  private readonly fillLayerId = 'utm-active-geofences-fill';
  private readonly lineLayerId = 'utm-active-geofences-line';

  constructor(private geofences: GeofenceService) {}

  attach(map: mapboxgl.Map): void {
    this.map = map;

    if (!this.sub) {
      this.sub = this.geofences.state$.subscribe((state) => {
        const visible = Boolean(state.enabled && state.locationPermissionOk);
        this.visible = visible;
        this.fences = state.activeGeofences;
        this.updateOverlay(visible ? state.activeGeofences : []);
      });
    }

    // Style reload wipes sources/layers, so re-apply current state whenever attach is called.
    this.updateOverlay(this.visible ? this.fences : []);
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

  private updateOverlay(fences: BgGeofence[]): void {
    const map = this.map;
    if (!map) {
      return;
    }

    if (!fences?.length) {
      this.removeOverlay();
      return;
    }

    const data = this.buildGeoJson(fences);

    const existing = map.getSource(this.sourceId) as
      | mapboxgl.GeoJSONSource
      | undefined;

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
    fences: BgGeofence[],
  ): FeatureCollection<Polygon, GeofenceOverlayProperties> {
    const features: Array<Feature<Polygon, GeofenceOverlayProperties>> = [];

    for (const f of fences) {
      const lat = f.latitude;
      const lng = f.longitude;
      if (!lat || !lng) {
        console.warn('Geofence missing latitude or longitude', f);
        continue;
      }

      const radius = f.radius;
      if (!radius) {
        console.warn('Geofence missing radius', f);
        continue;
      }

      const properties: GeofenceOverlayProperties = {
        identifier: f.identifier,
        radius,
      };

      const circlePoly: Feature<Polygon, GeofenceOverlayProperties> =
        turfCircle([lng, lat], radius / 1000, {
          steps: 64,
          units: 'kilometers',
          properties,
        });

      features.push(circlePoly);
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
