import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor() {}

  ngOnInit(): void {
    this.initMapbox();
  }

  fetchLocationData() {
    // let location_data = false;
    // fetch(map_geo)
    //   .then((response) => response.json())
    //   .then((json) => {
    //     location_data = json.features;
    //   });
  }

  initMapbox() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiY2Itc3R1ZGlvIiwiYSI6ImNrcDUxZW04MjBjZ3gydHF0bmUyano0bncifQ.MLaKn3TF2V4b4ICX1HJnnA';

    const map = new mapboxgl.Map({
      container: 'mapbox',
      // style: 'mapbox://styles/mapbox/streets-v12',
      // style: 'mapbox://styles/mapbox/navigation-night-v1',
      // style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [5.122222, 52.090833],
      zoom: 10,
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
    map.addControl(nav, 'top-right');
    map.addControl(
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
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.on('click', () => {
      map.scrollZoom.enable();
    });
    map.on('movestart', () => {
      map.scrollZoom.enable();
    });
    map.on('touchstart', () => {
      map.scrollZoom.enable();
    });

    map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      )?.id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
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
    });
  }
}
