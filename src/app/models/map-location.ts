export interface MapLocation {
  nid: string;
  title: string;
  url: string;
  address: string;
  city: string;
  geo: string;
  thumb: string;
  image_small: string;
  head: string;
  story_theme_ids_str: string;
  story_theme_ids: string[];
  hide_from_map_str: string;
  hide_from_map: boolean;
  max_date_str: string;
  max_dates: string[];
  min_date_str: string;
  min_dates: string[];
  organisation_ids_str: string;
  organisation_ids: string[];
}
