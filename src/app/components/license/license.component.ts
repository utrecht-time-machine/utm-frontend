import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { License } from '../../models/license';

@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.scss'],
    standalone: false
})
export class LicenseComponent {
  @Input() licenseLabel: string | undefined = undefined;

  readonly LICENSE_IMAGE_FOLDER: string =
    environment.imageBaseUrl + '/sites/images';

  readonly LICENSE_URL_LOOKUP: { [licenseLabel: string]: License } = {
    'CC0, No Rights Reserved': {
      title: 'CC0, No Rights Reserved',
      url: 'https://creativecommons.org/about/cc0',
      image: this.LICENSE_IMAGE_FOLDER + '/zero.png',
    },
    'Public Domain': {
      title: 'Public Domain',
      url: 'https://creativecommons.org/about/pdm',
      image: this.LICENSE_IMAGE_FOLDER + '/public_domain.png',
    },
    'Attribution CC BY': {
      title: 'Attribution CC BY',
      url: 'https://creativecommons.org/licenses/by/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by.png',
    },
    'Attribution, Share Alike CC BY-SA': {
      title: 'Attribution, Share Alike CC BY-SA',
      url: 'https://creativecommons.org/licenses/by-sa/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by-sa.png',
    },
    'Attribution, No Derivative Works CC BY-ND': {
      title: 'Attribution, No Derivative Works CC BY-ND',
      url: 'https://creativecommons.org/licenses/by-nd/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by-nd.png',
    },
    'Attribution, Non-Commercial CC BY-NC': {
      title: 'Attribution, Non-Commercial CC BY-NC',
      url: 'https://creativecommons.org/licenses/by-nc/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by-nc.png',
    },
    'Attribution, Non-Commercial, Share Alike CC BY-NC-SA': {
      title: 'Attribution, Non-Commercial, Share Alike CC BY-NC-SA',
      url: 'https://creativecommons.org/licenses/by-nc-sa/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by-nc-sa.png',
    },
    'Attribution, Non-Commercial, No Derivative Works CC BY-NC-ND': {
      title: 'Attribution, Non-Commercial, No Derivative Works CC BY-NC-ND',
      url: 'https://creativecommons.org/licenses/by-nc-nd/3.0/nl',
      image: this.LICENSE_IMAGE_FOLDER + '/by-nc-nd.png',
    },
  };

  public get license(): License {
    const licenseNotFound =
      !this.licenseLabel || !(this.licenseLabel in this.LICENSE_URL_LOOKUP);
    if (licenseNotFound) {
      return {
        title: this.licenseLabel as string,
      };
    }
    return this.LICENSE_URL_LOOKUP[this.licenseLabel as string];
  }
}
