import { Story } from './story';
import { LocationDetails } from './location-details';

export interface UtmRouteStop {
  id: string;
  title: string;
  intro?: string;
  audio?: string;
  audio_english?: string;
  location_id: string;
  story_ids: string;
  route_id: string;

  show_location_info: boolean;

  location?: LocationDetails;
  stories?: Story[];
}
