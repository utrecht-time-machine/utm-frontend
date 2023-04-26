import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './components/header/header.module';
import { FooterModule } from './components/footer/footer.module';
import { MapModule } from './components/map/map.module';
import { MenuButtonModule } from './components/menu-button/menu-button.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HeaderModule,
    FooterModule,
    MapModule,
    MenuButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
