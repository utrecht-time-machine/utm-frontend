import { MediaItem } from './media-item';

export interface Story {
  nid: string;
  title: string;
  title_english?: string;
  photo: string;
  has_video_icon: string;
  story_id: string;
  story_link: string;
  story_url_alias: string;
  audio: string;

  mediaItems?: MediaItem[];

  // TODO: Remove these (stories will not map to only one location anymore)
  location_id: string;
  location_title: string;
  location_url: string;
}
