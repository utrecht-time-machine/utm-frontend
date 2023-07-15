import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MenuLinksModule } from '../menu-links/menu-links.module';
import { OrganisationsModule } from '../organisations/organisations.module';

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [CommonModule, MenuLinksModule, OrganisationsModule],
})
export class FooterModule {}
