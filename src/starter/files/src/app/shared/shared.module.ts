import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

const globalSettings: RecaptchaSettings = {
  siteKey: environment.reCaptcha.siteKey,
};

@NgModule({
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
  exports: [
    CommonModule,
    NgxMaskModule,
    CurrencyMaskModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RecaptchaModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: globalSettings,
    },
  ],
})
export class SharedModule {}
