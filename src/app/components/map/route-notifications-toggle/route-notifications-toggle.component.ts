import { Component, Input } from '@angular/core';
import { RouteNotificationsToggleCompactComponent } from './route-notifications-toggle-compact/route-notifications-toggle-compact.component';
import { RouteNotificationsToggleExpandedComponent } from './route-notifications-toggle-expanded/route-notifications-toggle-expanded.component';

@Component({
  selector: 'app-route-notifications-toggle',
  imports: [
    RouteNotificationsToggleExpandedComponent,
    RouteNotificationsToggleCompactComponent,
  ],
  templateUrl: './route-notifications-toggle.component.html',
  styleUrls: ['./route-notifications-toggle.component.scss'],
})
export class RouteNotificationsToggleComponent {
  @Input() variant: 'expanded' | 'compact' = 'expanded';

  constructor() {}
}
