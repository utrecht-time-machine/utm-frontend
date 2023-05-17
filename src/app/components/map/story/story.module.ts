import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story.component';
import { MediaItemModule } from '../media-item/media-item.module';

@NgModule({
  declarations: [StoryComponent],
  exports: [StoryComponent],
  imports: [CommonModule, MediaItemModule],
})
export class StoryModule {}
