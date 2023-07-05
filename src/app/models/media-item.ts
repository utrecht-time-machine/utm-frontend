import { Organisation } from './organisation';

export interface MediaItem {
  title: string;
  media_id: string;
  media_file: string;
  has_audio: boolean;
  source_link: string;
  source_name: string;
  image_small: string;
  license: string;
  caption: string;
  text: string;
  embed_url: string;
  type: MediaItemType;
  organisation_ids: string;

  organisations?: Organisation[];
}

export enum MediaItemType {
  Undefined,
  Image,
  Video,
  Embed,
}
