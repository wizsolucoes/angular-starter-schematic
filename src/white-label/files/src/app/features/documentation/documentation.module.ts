import { NgModule } from '@angular/core';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DocumentationComponent],
  imports: [SharedModule, DocumentationRoutingModule],
})
export class DocumentationModule {}
