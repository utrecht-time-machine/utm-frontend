import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story.component';

@NgModule({
  declarations: [StoryComponent],
  exports: [StoryComponent],
  imports: [CommonModule],
})
export class StoryModule {}
