import { Injectable } from '@angular/core';
import { EnvironmentService } from '../environment/environment.service';
import {
  ApplicationInsights,
  IExceptionTelemetry,
} from '@microsoft/applicationinsights-web';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  appInsights: ApplicationInsights;

  constructor(private router: Router, private environment: EnvironmentService) {
    if (this.environment.production) {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: this.environment.appInsights.instrumentationKey,
          enableAutoRouteTracking: true,
        },
      });

      this.appInsights.loadAppInsights();
      this.createRouterSubscription();
    }
  }

  logPageView(name?: string, uri?: string): void {
    if (this.appInsights) {
      this.appInsights.trackPageView({ name, uri });
    }
  }

  logException(error: Error): void {
    const exception: IExceptionTelemetry = {
      exception: error,
    };
    if (this.appInsights) {
      this.appInsights.trackException(exception);
    }
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.logPageView(null, event.urlAfterRedirects);
      });
  }
}
