import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  showNav = false;
  features: string[] | undefined;
  logoUrl: string | undefined;

  constructor(
    private configurationService: ConfigurationService,
    private sso: SSOConectorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const appConfig = this.configurationService.getConfigSync();
    if (appConfig) {
      this.features = appConfig['features'];
      this.logoUrl = appConfig['logoImageUrl'];
    }

    this.showNav = !!SSOConectorService.isLogged();

    this.router.events.subscribe(() => {
      this.showNav = !!SSOConectorService.isLogged();
    });
  }

  isFeatureEnabled(key: string): boolean {
    return !!this.features && this.features.includes(key);
  }

  logOut(): void {
    this.sso.logOut();
    this.router.navigate(['/login']);
  }
}
