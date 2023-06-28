import { MediaItem } from './media-item';
import { Story } from './story';

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

  stop_image_license: string;
  stop_image_source_name: string;
  stop_image_source_link: string;

  location_text: string;
  location_teaser: string;

  location_stories: Story[];

  media_items: MediaItem[];
}
