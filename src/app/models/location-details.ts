import { Story } from './story';

export interface LocationDetails {
  type: string;
  nid: string;
  title: string;
  url: string;
  address: string;
  city: string;
  thumb: string;
  geo: string;
  coords: { lat: number; long: number };
  source_link: string;
  source_name: string;
  image: string;
  license: string;
  caption: string;
  head: string;
  orgs: string;
  zipcode: string;
  teaser: string;
  text: string;
  stories: Story[];
}
