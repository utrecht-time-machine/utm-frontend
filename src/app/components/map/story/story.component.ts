import { Component } from '@angular/core';
import { StoryService } from '../../../services/story.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  constructor(public story: StoryService) {}

  ngOnInit() {}
}
