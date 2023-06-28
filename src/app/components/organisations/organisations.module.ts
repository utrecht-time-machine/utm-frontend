import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationsComponent } from './organisations.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [OrganisationsComponent],
  exports: [OrganisationsComponent],
  imports: [CommonModule, TranslateModule],
})
export class OrganisationsModule {}
