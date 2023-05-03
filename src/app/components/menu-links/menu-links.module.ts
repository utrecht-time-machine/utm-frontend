import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLinksComponent } from './menu-links.component';

@NgModule({
  declarations: [MenuLinksComponent],
  exports: [MenuLinksComponent],
  imports: [CommonModule],
})
export class MenuLinksModule {}
