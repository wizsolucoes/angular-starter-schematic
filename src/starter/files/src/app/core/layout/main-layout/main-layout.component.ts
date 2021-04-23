import { Component, OnInit } from '@angular/core';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn = false;
  constructor(private sso: SSOConectorService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!SSOConectorService.isLogged();
  }
}