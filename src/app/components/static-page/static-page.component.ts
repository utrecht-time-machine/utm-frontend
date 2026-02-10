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
    private router: Router,
  ) {
    this.translate.onLangChange.subscribe(() => {
      const nid = this.route.snapshot.data['pageData']?.nid;
      if (nid) {
        void this.loadContent(nid);
      }
    });
  }

  ngOnInit() {
    // console.log('StaticPageComponent ngOnInit');
    this.route.data.subscribe(async (data) => {
      // console.log('StaticPageComponent data', data);
      await this.loadContent(data['pageData']?.nid);
    });
  }

  async loadContent(nid?: string) {
    console.log('StaticPageComponent loadContent', nid);
    if (!nid) {
      console.log('StaticPageComponent no nid');
      void this.router.navigate([DEFAULT_HOME_URL]);
      return;
    }

    this.spinner.loadingStaticPage = true;

    try {
      this.content = await this.apiService.getStaticPage(nid);
      // console.log('StaticPageComponent content', this.content);
      if (!this.content) {
        void this.router.navigate([DEFAULT_HOME_URL]);
      }
    } catch (error) {
      console.error('Error loading static page', error);
      void this.router.navigate([DEFAULT_HOME_URL]);
    } finally {
      this.spinner.loadingStaticPage = false;
    }
  }

  getPhotoBgImageUrl(): string {
    return `url('${this.content?.photo}')`;
  }
}
