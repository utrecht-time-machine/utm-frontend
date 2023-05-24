import { Component } from '@angular/core';
import { StoryService } from '../../../services/story.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  constructor(public story: StoryService, public router: Router) {}

  ngOnInit() {}

  onLocationLinkClicked() {
    const locationUrl: string | undefined =
      this.story.shownStory.getValue()?.location_url;
    if (locationUrl) {
      void this.router.navigateByUrl(locationUrl);
    }
  }
}
