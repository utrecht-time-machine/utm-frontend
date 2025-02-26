import { Component, Input } from '@angular/core';
import { LocationDetails } from '../../../models/location-details';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RoutingService } from '../../../services/routing.service';
import { Story } from '../../../models/story';
import { StoryService } from '../../../services/story.service';
import { UtmTranslateService } from '../../../services/utm-translate.service';
import { TimeService } from '../../../services/time.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss'],
})
export class SelectedItemComponent {
  @Input() locationDetails: LocationDetails | undefined;
  readMoreIsShown = false;

  constructor(
    public router: Router,
    public routing: RoutingService,
    public location: Location,
    public storyService: StoryService,
    public utmTranslate: UtmTranslateService,
    public time: TimeService,
    public themes: ThemeService
  ) {}

  locationHasStories(): boolean {
    if (!this.locationDetails?.stories) {
      return false;
    }
    return this.locationDetails.stories.length > 0;
  }

  storyHasVideoIcon(story: Story): boolean {
    return story.has_video_icon !== 'Uit';
  }

  onCloseStoryClicked() {
    const locationUrl: string | undefined =
      this.storyService.shownStory.getValue()?.location_url;
    if (locationUrl) {
      void this.router.navigateByUrl(locationUrl);
    }
  }

  shouldShowStory(story: Story): boolean {
    return (
      this.themes.shouldShow(story.theme_ids ?? []) &&
      this.time.isInSelectedRange([story.min_date_str], [story.max_date_str])
    );
  }

  get shownStories(): Story[] {
    return (
      this.locationDetails?.stories?.filter((story) =>
        this.shouldShowStory(story)
      ) ?? []
    );
  }
}
