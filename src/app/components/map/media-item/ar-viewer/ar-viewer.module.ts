import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArViewerComponent } from './ar-viewer.component';

@NgModule({
  declarations: [ArViewerComponent],
  exports: [ArViewerComponent],
  imports: [CommonModule],
})
export class ArViewerModule {}
