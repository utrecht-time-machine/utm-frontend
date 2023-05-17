import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaItemComponent } from './media-item.component';
import { SafeModule } from '../../../pipes/safe.module';

@NgModule({
  declarations: [MediaItemComponent],
  imports: [CommonModule, SafeModule],
  exports: [MediaItemComponent],
})
export class MediaItemModule {}
