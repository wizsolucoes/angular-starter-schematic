import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SSOConectorService, Token } from '@wizsolucoes/ngx-wiz-sso';
import { Observable } from 'rxjs';
import { Util } from '../../../shared/utils/util';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  showNav = false;
  logoUrl =
    'https://raw.githubusercontent.com/wizsolucoes/angular-white-label-schematic/master/docs/logowiz.png';

  constructor(
    private sso: SSOConectorService,
    private readonly router: Router,
    ) {}

  ngOnInit(): void {
    this.showNav = !!SSOConectorService.isLogged();

    this.router.events.subscribe((event) => {
      this.showNav = !!SSOConectorService.isLogged();
    });

    this.isLoggedIn = !!SSOConectorService.isLogged();
  }

  logOut(): void {
    this.sso.logOut();
    Util.windowReload();
  }
}
