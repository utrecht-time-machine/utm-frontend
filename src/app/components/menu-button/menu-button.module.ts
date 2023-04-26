import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuButtonComponent } from './menu-button.component';

@NgModule({
  declarations: [MenuButtonComponent],
  exports: [MenuButtonComponent],
  imports: [CommonModule],
})
export class MenuButtonModule {}
