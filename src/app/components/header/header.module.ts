import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MenuLinksModule } from '../menu-links/menu-links.module';
import { TranslateModule } from '@ngx-translate/core';
import { LangToggleModule } from '../lang-toggle/lang-toggle.module';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [CommonModule, RouterModule, MenuLinksModule, TranslateModule, LangToggleModule],
})
export class HeaderModule {}
