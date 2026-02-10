import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

const bootstrap = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
};

const isCordovaApp = typeof (window as any)['cordova'] !== 'undefined';
if (isCordovaApp) {
  document.addEventListener(
    'deviceready',
    () => {
      bootstrap();
    },
    false,
  );
} else {
  bootstrap();
}
