import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaItemComponent } from './media-item.component';
import { SafeModule } from '../../../pipes/safe.module';
import { LicenseModule } from '../../license/license.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MediaItemComponent],
  imports: [CommonModule, SafeModule, LicenseModule, TranslateModule],
  exports: [MediaItemComponent],
})
export class MediaItemModule {}
