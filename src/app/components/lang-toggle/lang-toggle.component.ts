import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UtmRoutesService } from '../../services/utm-routes.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-lang-toggle',
  templateUrl: './lang-toggle.component.html',
  styleUrls: ['./lang-toggle.component.scss'],
})
export class LangToggleComponent {
  readonly LOCAL_STORAGE_LANG_KEY = 'utrechtTimeMachineLanguage';

  constructor(
    public translate: TranslateService,
    private router: Router,
    private utmRoutes: UtmRoutesService,
    private platform: PlatformService
  ) {}

  async onLanguageSelect(language: string) {
    if (this.translate.currentLang === language) {
      return;
    }

    if (this.platform.isBrowser()) {
      window.localStorage.setItem(this.LOCAL_STORAGE_LANG_KEY, language);
    }

    this.translate.use(language);

    await this.utmRoutes.load();
    await this.utmRoutes.selectByUrlOrId(this.router.url, undefined, true);
  }

  ngOnInit() {
    if (!this.translate.currentLang) {
      this.translate.use(this.translate.defaultLang);
    }

    let localStorageLang: string | null = null;

    if (this.platform.isBrowser()) {
      localStorageLang = window.localStorage.getItem(
        this.LOCAL_STORAGE_LANG_KEY
      );
    }

    if (localStorageLang) {
      this.translate.use(localStorageLang);
    }
  }
}
