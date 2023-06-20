import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnescapePipe } from './unescape.pipe';

@NgModule({
  declarations: [UnescapePipe],
  imports: [CommonModule],
  exports: [UnescapePipe],
  providers: [UnescapePipe],
})
export class UnescapeModule {}
