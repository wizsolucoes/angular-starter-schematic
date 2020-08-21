import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../environment/environment.service';
import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  const environment = new EnvironmentService();

  describe('in production mode', () => {
    let router: Router;
    let service: MonitoringService;
    beforeEach(() => {
      environment.production = true;

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'home',
            },
          ]),
        ],
        providers: [{ provide: EnvironmentService, useValue: environment }],
      });
      service = TestBed.inject(MonitoringService);
      router = TestBed.inject(Router);
      router.initialNavigation();
      service.logException(new Error());
    });

    it('should instantiate ApplicationInsights when constucted', () => {
      expect(service.appInsights).toBeTruthy();
    });
  });

  describe('NOT in production mode', () => {
    let service: MonitoringService;
    let router: Router;
    beforeEach(() => {
      environment.production = false;

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'home',
            },
          ]),
        ],
        providers: [{ provide: EnvironmentService, useValue: environment }],
      });
      service = TestBed.inject(MonitoringService);
      router = TestBed.inject(Router);
      service.logPageView('any', 'thing');
      service.logException(new Error());
    });

    it('should NOT instantiate ApplicationInsights when constucted', () => {
      expect(service.appInsights).not.toBeTruthy();
    });
  });
});
