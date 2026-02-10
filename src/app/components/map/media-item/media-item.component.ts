import { Component, Input } from '@angular/core';
import { MediaItem, MediaItemType } from '../../../models/media-item';

@Component({
  selector: 'app-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  standalone: false,
})
export class MediaItemComponent {
  @Input() mediaItem: MediaItem | undefined;
  @Input() addTopMargin = true;
  @Input() showTitle = true;

  MediaItemType = MediaItemType;

  hasHead() {
    const hasHead = this.mediaItem?.text && this.mediaItem.text !== '<p></p>';
    return hasHead;
  }
}
