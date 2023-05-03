import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuButtonComponent } from './menu-button.component';
import { MenuLinksModule } from '../menu-links/menu-links.module';

@NgModule({
  declarations: [MenuButtonComponent],
  exports: [MenuButtonComponent],
  imports: [CommonModule, MenuLinksModule],
})
export class MenuButtonModule {}
