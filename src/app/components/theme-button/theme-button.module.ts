import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeButtonComponent } from './theme-button.component';

@NgModule({
  declarations: [ThemeButtonComponent],
  exports: [ThemeButtonComponent],
  imports: [CommonModule],
})
export class ThemeButtonModule {}
