import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLinksComponent } from './menu-links.component';
import { TranslateModule } from '@ngx-translate/core';
import { LangToggleModule } from '../lang-toggle/lang-toggle.module';

@NgModule({
  declarations: [MenuLinksComponent],
  exports: [MenuLinksComponent],
  imports: [CommonModule, TranslateModule, LangToggleModule],
})
export class MenuLinksModule {}
