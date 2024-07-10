import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ar360Viewer } from './ar-360-viewer.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [Ar360Viewer],
  exports: [Ar360Viewer],
  imports: [CommonModule, TranslateModule],
})
export class Ar360ViewerModule {}
