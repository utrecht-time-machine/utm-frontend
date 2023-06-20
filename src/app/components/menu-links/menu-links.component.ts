import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { SelectedView } from '../../models/selected-view';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-menu-links',
  templateUrl: './menu-links.component.html',
  styleUrls: ['./menu-links.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuLinksComponent {
  @Input() showLanguageToggle = true;

  SelectedView = SelectedView;

  constructor(
    public router: Router,
    public routing: RoutingService,
    private platform: PlatformService
  ) {}

  clickOnLink(url: string) {
    void this.router.navigateByUrl(url);
    setTimeout(() => {
      if (this.platform.isBrowser()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
