import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  showNav = false;
  logoUrl =
    'https://raw.githubusercontent.com/wizsolucoes/angular-white-label-schematic/master/docs/logowiz.png';

  constructor(
    private sso: SSOConectorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.showNav = !!SSOConectorService.isLogged();

    this.router.events.subscribe(() => {
      this.showNav = !!SSOConectorService.isLogged();
    });
  }

  logOut(): void {
    this.sso.logOut();
    this.router.navigate(['/login']);
  }
}
