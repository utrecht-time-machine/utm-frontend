import { Organisation } from './organisation';

export interface MediaItem {
  title: string;
  media_id: string;
  media_file: string;
  has_audio: boolean;
  audio_transcript?: string;
  source_link: string;
  source_name: string;
  image_small: string;
  license: string;
  caption: string;
  text: string;
  embed_url: string;
  type: MediaItemType;
  organisation_ids: string;
  ar_360_photo: string;
  ar_360_photo_default_yaw: number;
  ar_360_photo_default_pitch: number;
  ar_360_photo_default_zoom: number;
  ar_360_video: string;

  organisations?: Organisation[];
}

export enum MediaItemType {
  Undefined,
  Image,
  Video,
  Embed,
  AR,
}
