import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

@NgModule({
  declarations: [SalesComponent],
  imports: [SharedModule, SalesRoutingModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesModule {}
