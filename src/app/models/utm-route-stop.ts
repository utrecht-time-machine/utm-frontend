import { MediaItem } from './media-item';

export interface UtmRouteStop {
  stop_id: string;
  stop_type: string;
  title: string;
  address: string;
  route_id: string;
  geo: string;
  coords: { lat: number; lng: number };
  audio: string;
  stop_image: string;
  stop_thumb: string;
  location_text: string;
  location_teaser: string;
  media_items: MediaItem[];
}
