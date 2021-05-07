import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  LOCALE_ID,
  NgModule,
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
import { TenantInterceptor } from './core/interceptors/tenant.interceptor';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CoreModule,
    SharedModule,
    NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
      properties: {},
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
    { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
