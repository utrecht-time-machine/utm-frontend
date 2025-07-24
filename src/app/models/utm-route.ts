import { UtmRouteStop } from './utm-route-stop';

export interface UtmRoute {
  title: string;
  title_english?: string;
  url: string;
  photo: string;
  head: string;
  head_english?: string;
  nid: string;
  stop_ids: string;
  duration_minutes: string;
  distance: string;
  teaser: string;
  teaser_english?: string;
  type: string;
  text: string;
  text_english?: string;
  stops?: UtmRouteStop[];
  geojson_url?: string;
  audio?: string;
  license?: string;
  caption?: string;
  source_link?: string;
  source_name?: string;

  max_date_str?: string;
  min_date_str?: string;
  theme_ids_str?: string;
  theme_ids: string[];
  organisation_ids_str?: string;
  organisation_ids: string[];

  show_only_in_dev_mode_plaintext?: string;
  show_only_in_dev_mode: boolean;
}
