import { Component } from '@angular/core';
import { UtmRoutesService } from '../../../services/utm-routes.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtmTranslateService } from '../../../services/utm-translate.service';

@Component({
  selector: 'app-selected-stop',
  templateUrl: './selected-stop.component.html',
  styleUrls: ['./selected-stop.component.scss'],
})
export class SelectedStopComponent {
  constructor(
    public utmRoutes: UtmRoutesService,
    public router: Router,
    public translate: TranslateService,
    public utmTranslate: UtmTranslateService
  ) {}

  ngOnInit() {}

  get shouldShowEnglishAudio(): boolean {
    if (!this.utmRoutes.selectedStop?.audio_english) {
      return false;
    }
    return this.translate.currentLang === 'en';
  }
}
