import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { MediaItemType } from '../../../models/media-item';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  MediaItemType = MediaItemType;
  constructor(public utmRoutes: UtmRoutesService) {}
}
