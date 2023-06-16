import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-toggle',
  templateUrl: './lang-toggle.component.html',
  styleUrls: ['./lang-toggle.component.scss'],
})
export class LangToggleComponent {
  readonly LOCAL_STORAGE_LANG_KEY = 'utrechtTimeMachineLanguage';

  constructor(public translate: TranslateService) {}

  onLanguageSelect(language: string) {
    if (this.translate.currentLang === language) {
      return;
    }

    localStorage.setItem(this.LOCAL_STORAGE_LANG_KEY, language);
    this.translate.use(language);
    location.reload();
  }

  ngOnInit() {
    if (!this.translate.currentLang) {
      this.translate.use(this.translate.defaultLang);
    }

    const localStorageLang: string | null = localStorage.getItem(
      this.LOCAL_STORAGE_LANG_KEY
    );
    if (localStorageLang) {
      this.translate.use(localStorageLang);
    }
  }
}
