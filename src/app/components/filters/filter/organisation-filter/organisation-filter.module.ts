import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganisationFilterComponent } from './organisation-filter.component';
import { FilterModule } from '../filter.module';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [OrganisationFilterComponent],
  imports: [
    CommonModule,
    FilterModule,
    TranslateModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  exports: [OrganisationFilterComponent],
})
export class OrganisationFilterModule {}
