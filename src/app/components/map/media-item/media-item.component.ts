import { Component, Input } from '@angular/core';
import { MediaItem, MediaItemType } from '../../../models/media-item';

@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
})
export class MediaItemComponent {
  @Input() mediaItem: MediaItem | undefined;
  MediaItemType = MediaItemType;
}
