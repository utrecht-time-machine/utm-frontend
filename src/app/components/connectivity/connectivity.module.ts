import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectivityComponent } from './connectivity.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConnectivityComponent],
  exports: [ConnectivityComponent],
  imports: [CommonModule, TranslateModule],
})
export class ConnectivityModule {}
