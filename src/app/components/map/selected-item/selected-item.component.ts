import { Component, Input } from '@angular/core';
import { LocationDetails } from '../../../models/location-details';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RoutingService } from '../../../services/routing.service';
import { Story } from '../../../models/story';
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
})
export class SelectedItemComponent {
  @Input() locationDetails: LocationDetails | undefined;

  constructor(
    public router: Router,
    public routing: RoutingService,
    public location: Location
  ) {}

  locationHasStories(): boolean {
    if (!this.locationDetails?.stories) {
      return false;
    }
    return this.locationDetails.stories.length > 0;
  }

  locationHasOrganisations(): boolean {
    if (!this.locationDetails?.organisations) {
      return false;
    }
    return this.locationDetails.organisations.length > 0;
  }

  storyHasVideoIcon(story: Story): boolean {
    return story.has_video_icon !== 'Uit';
  }
  licenseUrl(license: string | any): string {
    switch (license) {
      case "CC0, No Rights Reserved":
        return "https://creativecommons.org/about/cc0";
      case "Public Domain":
        return "https://creativecommons.org/about/pdm";
      case "Attribution CC BY":
        return "https://creativecommons.org/licenses/by/3.0/nl";
      case "Attribution, Share Alike CC BY-SA":
        return "https://creativecommons.org/licenses/by-sa/3.0/nl";
      case "Attribution, No Derivative Works CC BY-ND":
        return "https://creativecommons.org/licenses/by-nd/3.0/nl";
      case "Attribution, Non-Commercial CC BY-NC":
        return "https://creativecommons.org/licenses/by-nc/3.0/nl";
      case "Attribution, Non-Commercial, Share Alike CC BY-NC-SA":
        return "https://creativecommons.org/licenses/by-nc-sa/3.0/nl";
      case "Attribution, Non-Commercial, No Derivative Works CC BY-NC-ND":
        return "https://creativecommons.org/licenses/by-nc-nd/3.0/nl";
      default:
        return "";
    }
  }

  licenseImage(license: string | any): string {
    const folder = environment.imageBaseUrl+"/sites/images/";
    switch (license) {
      case "CC0, No Rights Reserved":
        return folder+"zero.png";
      case "Public Domain":
        return folder+"public_domain.png";
      case "Attribution CC BY":
        return folder+"by.png";
      case "Attribution, Share Alike CC BY-SA":
        return folder+"by-sa.png";
      case "Attribution, No Derivative Works CC BY-ND":
        return folder+"by-nd.png";
      case "Attribution, Non-Commercial CC BY-NC":
        return folder+"by-nc.png";
      case "Attribution, Non-Commercial, Share Alike CC BY-NC-SA":
        return folder+"by-nc-sa.png";
      case "Attribution, Non-Commercial, No Derivative Works CC BY-NC-ND":
        return folder+"by-nc-nd.png";
      default:
        return "";
    }
  }
}
