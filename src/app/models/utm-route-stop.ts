import { Story } from './story';
import { LocationDetails } from './location-details';

export interface UtmRouteStop {
  id: string;
  title: string;
  location_id: string;
  story_ids: string;
  route_id: string;

  location?: LocationDetails;
  stories?: Story[];
}
