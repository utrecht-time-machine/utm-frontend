import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Story } from '../../../models/story';

@Component({
  selector: 'app-story-preview',
  templateUrl: './story-preview.component.html',
  styleUrls: ['./story-preview.component.scss'],
})
export class StoryPreviewComponent {
  @Input() story: Story | undefined;
  @Input() url: string = '';
  constructor(public router: Router) {}

  storyHasVideoIcon(): boolean {
    return this.story?.has_video_icon !== 'Uit';
  }
}
