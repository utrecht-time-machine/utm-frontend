import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { SeoService } from './services/seo.service';
import { ConnectivityService } from './services/connectivity.service';
import { MenuService } from './services/menu.service';
import { StoryService } from './services/story.service';
import { NotificationClickService } from './services/notification-click.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public spinner: SpinnerService,
    public seoService: SeoService,
    public connectivity: ConnectivityService,
    public menu: MenuService,
    public story: StoryService,
    _notificationClick: NotificationClickService
  ) {}
}
