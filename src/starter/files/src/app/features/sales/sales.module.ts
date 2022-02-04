import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSyzCpfSearchModule } from '@wizsolucoes/ng-syz';

@NgModule({
  declarations: [SalesComponent],
  imports: [
    SharedModule,
    SalesRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgSyzCpfSearchModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesModule {}
