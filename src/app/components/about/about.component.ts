import { Component } from '@angular/core';
import { StaticPage } from '../../models/static-page';
import { ApiService } from '../../services/api.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  content: StaticPage | undefined;

  constructor(public apiService: ApiService, public spinner: SpinnerService) {}

  ngOnInit() {
    void this.loadContent();
  }

  async loadContent() {
    this.spinner.loadingAbout = true;
    this.content = await this.apiService.getStaticPage('Over');
    this.spinner.loadingAbout = false;
  }
}
