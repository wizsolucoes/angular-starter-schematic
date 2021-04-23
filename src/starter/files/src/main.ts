import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {
  applyPolyfills,
  defineCustomElements,
} from '@wizsolucoes/wiz-loader/loader';
import { defineCustomElements as defineWizAlert } from '@wizsolucoes/wiz-alerts/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

applyPolyfills().then(() => {
  defineCustomElements();
  defineWizAlert();
});
