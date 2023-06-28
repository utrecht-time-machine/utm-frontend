import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryPreviewComponent } from './story-preview.component';

@NgModule({
  declarations: [StoryPreviewComponent],
  exports: [StoryPreviewComponent],
  imports: [CommonModule],
})
export class StoryPreviewModule {}
