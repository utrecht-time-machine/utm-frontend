import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';

@Component({
  selector: 'app-menu-links',
  templateUrl: './menu-links.component.html',
  styleUrls: ['./menu-links.component.scss'],
})
export class MenuLinksComponent {
  SelectedView = SelectedView;

  constructor(public router: Router, public routing: RoutingService) {}
}
