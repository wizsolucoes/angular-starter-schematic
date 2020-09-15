import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { CoreModule } from '../../core.module';
import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { EnvironmentService } from '../environment/environment.service';
import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
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
          CoreModule,
        ],
        declarations: [AppComponent, MainLayoutComponent],
        providers: [{ provide: EnvironmentService, useValue: environment }],
      });
      service = TestBed.inject(MonitoringService);
      fixture = TestBed.createComponent(AppComponent);
      app = fixture.componentInstance;
      router = TestBed.inject(Router);
    });

    it('should instantiate ApplicationInsights when constucted', () => {
      expect(service.appInsights).toBeTruthy();
    });

    it('should call trackPageView on navigation', fakeAsync(() => {
      // Given
      spyOn(service.appInsights, 'trackPageView');

      // When
      fixture.ngZone.run(() => {
        router.initialNavigation();
      });

      // Then
      tick();
      expect(service.appInsights.trackPageView).toHaveBeenCalled();
    }));

    it('should call trackPageView on navigation', fakeAsync(() => {
      // Given
      spyOn(service.appInsights, 'trackException');

      // When
      service.logException(new Error('some error'));

      // Then
      tick();
      expect(service.appInsights.trackException).toHaveBeenCalled();
    }));
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
