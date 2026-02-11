import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { PlatformService } from '../../services/platform.service';
import { MapService } from '../../services/map.service';
import { UtmTranslateService } from '../../services/utm-translate.service';
import { SelectedView } from '../../models/selected-view';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-lang-toggle',
  templateUrl: './lang-toggle.component.html',
  styleUrls: ['./lang-toggle.component.scss'],
  standalone: false,
})
export class LangToggleComponent {
  readonly LOCAL_STORAGE_LANG_KEY = 'utrechtTimeMachineLanguage';

  constructor(
    public translate: TranslateService,
    private router: Router,
    private utmRoutes: UtmRoutesService,
    private platform: PlatformService,
    private map: MapService,
    private utmTranslate: UtmTranslateService,
    private routing: RoutingService,
  ) {}

  async onLanguageSelect(language: string) {
    if (this.translate.currentLang === language) {
      return;
    }

    if (this.platform.isBrowser()) {
      window.localStorage.setItem(this.LOCAL_STORAGE_LANG_KEY, language);
    }

    this.translate.use(language);

    this.utmRoutes.load().then(async () => {
      const selectedId = this.utmRoutes.selected.getValue()?.nid;
      if (selectedId) {
        await this.utmRoutes.selectById(selectedId);
      }
    });

    const showLocationsOnMap = this.routing.getSelectedView() === SelectedView.Locations;
    this.map.addMapLocationsFromServer(!showLocationsOnMap, false).then(async () => {
      const selectedId = this.map.selectedLocation.getValue()?.nid;
      if (selectedId) {
        await this.map.selectLocationById(selectedId);
      }
      this.map.updateLocationsClosestToCenter();
    });
  }

  ngOnInit() {
    if (!this.translate.currentLang) {
      this.translate.use(this.translate.defaultLang);
    }

    let localStorageLang: string | null = null;

    if (this.platform.isBrowser()) {
      localStorageLang = window.localStorage.getItem(this.LOCAL_STORAGE_LANG_KEY);
    }

    if (localStorageLang) {
      this.translate.use(localStorageLang);
    }
  }
}
