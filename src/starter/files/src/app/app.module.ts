import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DefaultInterceptor } from './core/interceptors/default.interceptor';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    AppRoutingModule,
    NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
