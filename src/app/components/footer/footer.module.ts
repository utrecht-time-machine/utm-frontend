import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MenuLinksModule } from '../menu-links/menu-links.module';

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [CommonModule, MenuLinksModule],
})
export class FooterModule {}
