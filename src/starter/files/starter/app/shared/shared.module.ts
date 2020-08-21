import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxMaskModule.forRoot(), CurrencyMaskModule],
  exports: [CommonModule, NgxMaskModule, CurrencyMaskModule],
})
export class SharedModule {}
