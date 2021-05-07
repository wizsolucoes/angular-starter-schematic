import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { environment } from 'src/environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MainLayoutComponent, NavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    NgxWizSSOModule.forRoot(environment.ssoConfig),
    MatToolbarModule,
    MatButtonModule,
  ],
  exports: [MainLayoutComponent, NgxWizSSOModule],
})
export class CoreModule {}
