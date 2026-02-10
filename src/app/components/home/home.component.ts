import { Component } from '@angular/core';
import { StaticPage } from '../../models/static-page';
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ToCssUrlPipe } from '../../pipes/toCssUrl.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ToCssUrlPipe, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  introductionBlock: StaticPage | undefined;
  blocks: StaticPage[] | undefined;

  buttonLink = '/locaties';

  constructor(
    public apiService: ApiService,
    public spinner: SpinnerService,
    public translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe(() => {
      void this.loadContent();
    });
  }

  ngOnInit() {
    void this.loadContent();
  }

  async loadContent() {
    this.spinner.loadingHome = true;
    const blocks = await this.apiService.getHomeBlocks();
    if (blocks) {
      this.introductionBlock = blocks[0];
      this.blocks = blocks.slice(1);
      this.spinner.loadingHome = false;
    } else {
      console.error('Failed to load home blocks');
    }
  }
}
