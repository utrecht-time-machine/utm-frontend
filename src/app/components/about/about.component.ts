import { Component } from '@angular/core';
import { StaticPage } from '../../models/static-page';
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  content: StaticPage | undefined;

  constructor(
    public apiService: ApiService,
    public spinner: SpinnerService,
    public translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe(() => {
      void this.loadContent();
    });
  }

  ngOnInit() {
    void this.loadContent();
  }

  async loadContent() {
    this.spinner.loadingAbout = true;
    this.content = await this.apiService.getStaticPage(
      'Over Utrecht Time Machine'
    );
    this.spinner.loadingAbout = false;
  }

  getPhotoBgImageUrl(): string {
    return `url('${this.content?.photo}')`;
  }
}
