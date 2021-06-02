import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgApplicationInsightsService } from '@wizsolucoes/ng-application-insights';
import { AppConfiguration } from './core/services/configuration/configuration';
import { ConfigurationService } from './core/services/configuration/configuration.service';
import { ThemingService } from './core/services/theming/theming.service';
import hostTenantMap from './core/services/configuration/host-to-tenant-map';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private themingService: ThemingService,
    private configurationService: ConfigurationService,
    private appInsightsService: NgApplicationInsightsService
  ) {}

  isLoadingConfiguration: boolean | undefined;

  ngOnInit(): void {
    this.confgureApplication();
  }

  private confgureApplication(): void {
    this.isLoadingConfiguration = true;
    this.configurationService.disableCache();

    this.loadConfiguration().subscribe((data: any) => {
      this.themingService.setCSSVariables(this.document, data.theme);
      this.isLoadingConfiguration = false;
    });
  }

  private loadConfiguration(): Observable<AppConfiguration> {
    this.configurationService.tenantId = this.whoami();

    this.appInsightsService.setCustomProperties({
      'Tenant ID': this.configurationService.tenantId,
    });

    return this.configurationService.getConfig();
  }

  private whoami(): string {
    const url = new URL(window.location.href);
    return hostTenantMap[url.host];
  }
}
