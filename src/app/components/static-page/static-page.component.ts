import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticPage } from '../../models/static-page';
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { ToCssUrlPipe } from '../../pipes/toCssUrl.pipe';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ToCssUrlPipe],
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
})
export class StaticPageComponent implements OnInit {
  private pageTitle: string = '';
  content: StaticPage | undefined;

  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.translate.onLangChange.subscribe(() => {
      void this.loadContent();
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if ('pageTitle' in data) {
        this.pageTitle = data['pageTitle'];
        void this.loadContent();
      }
    });
  }

  async loadContent() {
    this.spinner.loadingStaticPage = true;
    this.content = await this.apiService.getStaticPage(this.pageTitle);
    this.spinner.loadingStaticPage = false;
  }

  getPhotoBgImageUrl(): string {
    return `url('${this.content?.photo}')`;
  }
}
