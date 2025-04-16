import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticPage } from '../../models/static-page';
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { ToCssUrlPipe } from '../../pipes/toCssUrl.pipe';
import { CommonModule } from '@angular/common';
import { DEFAULT_HOME_URL } from 'src/app/app-routing.module';

@Component({
  standalone: true,
  imports: [CommonModule, ToCssUrlPipe],
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
})
export class StaticPageComponent implements OnInit {
  content: StaticPage | undefined;

  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.translate.onLangChange.subscribe(() => {
      void this.loadContent();
    });
  }

  ngOnInit() {
    this.route.data.subscribe(async (data) => {
      await this.loadContent(data['pageData']?.nid);
    });
  }

  async loadContent(nid?: string) {
    if (!nid) {
      void this.router.navigate([DEFAULT_HOME_URL]);
      return;
    }

    this.spinner.loadingStaticPage = true;

    try {
      this.content = await this.apiService.getStaticPage(nid);

      if (!this.content) {
        void this.router.navigate([DEFAULT_HOME_URL]);
      }
    } catch (error) {
      void this.router.navigate([DEFAULT_HOME_URL]);
    } finally {
      this.spinner.loadingStaticPage = false;
    }
  }

  getPhotoBgImageUrl(): string {
    return `url('${this.content?.photo}')`;
  }
}
