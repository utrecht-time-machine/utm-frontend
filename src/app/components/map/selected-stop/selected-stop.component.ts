import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  constructor(public utmRoutes: UtmRoutesService, public router: Router) {}

  ngOnInit() {}
}
