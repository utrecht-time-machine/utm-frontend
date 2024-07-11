import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArComponent } from './ar.component';
import { ToCssUrlPipe } from '../../pipes/toCssUrl.pipe';
import { SafeModule } from '../../pipes/safe.module';

@NgModule({
  declarations: [ArComponent],
  imports: [CommonModule, ToCssUrlPipe, SafeModule],
})
export class ArModule {}
