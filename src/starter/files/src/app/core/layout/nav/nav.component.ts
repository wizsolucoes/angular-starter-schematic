import { Component, OnInit } from '@angular/core';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { Util } from '../../../shared/utils/util';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  logoUrl =
    'https://raw.githubusercontent.com/wizsolucoes/angular-white-label-schematic/master/docs/logowiz.png';

  constructor(private sso: SSOConectorService) {}

  ngOnInit(): void {
    this.isLoggedIn = !!SSOConectorService.isLogged();
  }

  logOut(): void {
    this.sso.logOut();
    Util.windowReload();
  }
}
