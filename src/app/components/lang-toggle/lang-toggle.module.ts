import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangToggleComponent } from './lang-toggle.component';

@NgModule({
  declarations: [LangToggleComponent],
  exports: [LangToggleComponent],
  imports: [CommonModule],
})
export class LangToggleModule {}
