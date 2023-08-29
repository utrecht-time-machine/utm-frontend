import { Component, HostListener } from '@angular/core';
import { StoryService } from '../../../services/story.service';
import { Router } from '@angular/router';
import { ImageViewerService } from '../../../services/image-viewer.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  constructor(
    public story: StoryService,
    public router: Router,
    public imageViewerService: ImageViewerService
  ) {}

  ngOnInit() {}

  onLocationLinkClicked() {
    const locationUrl: string | undefined =
      this.story.shownStory.getValue()?.location_url;
    if (locationUrl) {
      void this.router.navigateByUrl(locationUrl);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (!this.imageViewerService.isModalShown() && event.code === 'Escape') {
      this.onLocationLinkClicked();
    }
  }
}
