import { UtmRouteStop } from './utm-route-stop';

export interface UtmRoute {
  title: string;
  url: string;
  photo: string;
  head: string;
  nid: string;
  stop_ids: string;
  duration_minutes: string;
  distance: string;
  teaser: string;
  type: string;
  text: string;
  stops?: UtmRouteStop[];
  geojson_url?: string;
}
