import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  LOCALE_ID,
  ErrorHandler,
} from '@angular/core';
import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DefaultInterceptor } from './core/interceptors/default.interceptor';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
      properties: {},
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
