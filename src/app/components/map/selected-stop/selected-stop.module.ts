import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedStopComponent } from './selected-stop.component';
import { SafeModule } from '../../../pipes/safe.module';

@NgModule({
  declarations: [SelectedStopComponent],
  imports: [CommonModule, SafeModule],
  exports: [SelectedStopComponent],
})
export class SelectedStopModule {}
