import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { MediaItem, MediaItemType } from '../../../models/media-item';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  MediaItemType = MediaItemType;

  stopAsLocationMediaItems: MediaItem[] = [];

  constructor(public utmRoutes: UtmRoutesService) {
    this.utmRoutes.selectedStopIdx.subscribe(() => {
      this.updateSelectedStop();
    });
  }

  ngOnInit() {}

  updateSelectedStop() {
    if (this.utmRoutes.selectedStop?.stop_type === 'Locatie') {
      this.stopAsLocationMediaItems = [
        {
          caption: '',
          embed_url: '',
          image_small: this.utmRoutes.selectedStop?.stop_image as string,
          license: '',
          media_file: this.utmRoutes.selectedStop?.stop_image as string,
          media_id: '',
          source_link: '',
          source_name: '',
          text: this.utmRoutes.selectedStop?.location_teaser as string,
          type: MediaItemType.Image,
          title: '',
        },
      ];
    } else {
      this.stopAsLocationMediaItems = [];
    }
  }
}
