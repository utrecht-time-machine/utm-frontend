import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './components/header/header.module';
import { FooterModule } from './components/footer/footer.module';
import { MapModule } from './components/map/map.module';
import { MenuButtonModule } from './components/menu-button/menu-button.module';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RoutesModule } from './components/routes/routes.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConnectivityModule } from './components/connectivity/connectivity.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatomoTrackerModule, NgxMatomoRouterModule } from 'ngx-matomo-client';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HeaderModule,
    FooterModule,
    MapModule,
    MenuButtonModule,
    RoutesModule,
    TranslateModule.forRoot({
      defaultLanguage: 'nl',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxMatomoTrackerModule.forRoot({
      siteId: '1',
      trackerUrl: 'https://analytics.utrechttimemachine.nl/',
    }),
    NgxMatomoRouterModule,
    ConnectivityModule,
    BrowserAnimationsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
