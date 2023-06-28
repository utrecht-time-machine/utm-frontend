import { Story } from './story';
import { Organisation } from './organisation';

export interface LocationDetails {
  nid: string;
  type?: string;
  title?: string;
  url?: string;
  address?: string;
  city?: string;
  thumb?: string;
  geo: string;
  coords: { lat: number; lng: number };
  source_link?: string;
  source_name?: string;
  image?: string;
  license?: string;
  caption?: string;
  head?: string;
  organisation_ids?: Organisation[];
  organisations?: Organisation[];
  zipcode?: string;
  teaser?: string;
  text?: string;
  stories?: Story[];
}
