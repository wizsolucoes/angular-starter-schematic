import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { ssoConfig } from '../../config/sso_config';

@NgModule({
  declarations: [MainLayoutComponent, NavComponent],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    NgxWizSSOModule.forRoot(ssoConfig),
  ],
  exports: [MainLayoutComponent, NgxWizSSOModule],
})
export class CoreModule {}
