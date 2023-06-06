import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  constructor(public utmRoutes: UtmRoutesService) {}

  ngOnInit() {}
}
