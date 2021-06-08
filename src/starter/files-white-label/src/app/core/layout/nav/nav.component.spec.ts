import { environment } from './../../../../environments/environment';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { NavComponent } from './nav.component';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { SSOConectorService, NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { fakeToken } from '../../../../testing/fakes/fake_token';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './../../../features/login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let template: HTMLElement;
  let mockConfigService: jasmine.SpyObj<ConfigurationService>;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;
  let router: Router;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj('ConfigurationService', [
      'getConfigSync',
    ]);

    mockSSO = jasmine.createSpyObj('mockSSO', ['logOut', 'checkLogged']);
    const routes = [
      {
        path: 'login',
        component: LoginComponent,
      },
    ];

    TestBed.configureTestingModule({
      imports: [
        NgxWizSSOModule.forRoot(environment.ssoConfig),
        MatToolbarModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [NavComponent],
      providers: [
        { provide: ConfigurationService, useValue: mockConfigService },
        { provide: SSOConectorService, useValue: mockSSO },
      ],
    });

    mockSSO.checkLogged.and.returnValue(of(fakeToken));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    template = fixture.nativeElement;
    component.features = [];
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handles user authentication', () => {
    beforeEach(() => {
      const data = {
        features: ['sales', 'documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);
    });

    describe('when user is logged in', () => {
      beforeEach(() => {
        // Given
        userIsLoggedIn();

        // When
        fixture.detectChanges();
      });

      it('should display nav bar menu', () => {
        // Then
        expect(
          template.querySelector('[data-test="mat-toolbar"]')!.children.length
        ).toBe(5);
      });
    });

    describe('when user is NOT logged in', () => {
      beforeEach(() => {
        // Given
        userIsLoggedOut();

        // When
        fixture.detectChanges();
      });

      it('should NOT display nav bar menu', () => {
        // Then
        expect(
          template.querySelector('[data-test="navbar-menu"]')
        ).not.toBeTruthy();
      });
    });
  });

  describe('configuration', () => {
    beforeEach(() => {
      userIsLoggedIn();
    });

    it('should get enabled features from configuration service', () => {
      // Given
      const data = {
        features: ['sales', 'documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      // When
      fixture.detectChanges();

      // Then
      expect(component.features).toEqual(
        jasmine.arrayContaining(data.features)
      );
    });

    it('should get logo from configuration service', () => {
      // Given
      const data = {
        logoImageUrl: 'https://bulma.io/images/bulma-logo.png',
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      // When
      fixture.detectChanges();

      // Then
      expect(component.logoUrl).toBe(data.logoImageUrl);
    });

    it('#isFeatureEnabled', () => {
      // Given
      const data = {
        features: ['documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      fixture.detectChanges();

      expect(component.isFeatureEnabled('sales')).toBe(false);
      expect(component.isFeatureEnabled('documentation')).toBe(true);
    });

    it('should only have a link to enabled features', () => {
      // Given
      const data = {
        features: ['documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      fixture.detectChanges();

      expect(
        template.querySelector('[data-test="sales-link"]')
      ).not.toBeTruthy();
      expect(
        template.querySelector('[data-test="documentation-link"]')
      ).toBeTruthy();
    });
  });

  describe('actions', () => {
    it('#logout should call SSO logout', () => {
      // Given
      userIsLoggedIn();

      // When
      component.logOut();

      // Then
      expect(mockSSO.logOut).toHaveBeenCalled();
    });
  });

  describe('on navigation', () => {
    it('should set showNav to true if user is logged in', fakeAsync(() => {
      // Given
      userIsLoggedIn();

      const data = {
        features: ['sales', 'documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      // When
      component.ngOnInit();

      if (fixture.ngZone) {
        fixture.ngZone.run(() => {
          router.initialNavigation();
        });
      }

      tick();

      // Then
      expect(SSOConectorService.isLogged).toHaveBeenCalled();
      expect(component.showNav).toBeTrue();
    }));

    it('should set showNav to false if user is NOT logged in', fakeAsync(() => {
      // Given
      userIsLoggedOut();

      const data = {
        features: ['sales', 'documentation'],
      };
      mockConfigService.getConfigSync.and.returnValue(data);

      // When
      component.ngOnInit();

      if (fixture.ngZone) {
        fixture.ngZone.run(() => {
          router.initialNavigation();
        });
      }

      tick();

      // Then
      expect(SSOConectorService.isLogged).toHaveBeenCalled();
      expect(component.showNav).toBeFalse();
    }));
  });

  describe('a11y', () => {
    beforeEach(() => {
      userIsLoggedIn();

      fixture.detectChanges();

      it('images should be accessible', () => {
        expect(template.querySelector('[data-test="logo-img"]')).toBeTruthy();

        const logoImage = template.querySelector(
          '[data-test="logo-img"]'
        ) as HTMLImageElement;
        expect(logoImage.alt).toEqual('logo');
      });
    });
  });
});

// Helper functions

function userIsLoggedIn(): void {
  spyOn(SSOConectorService, 'isLogged').and.returnValue({
    tokenType: 'foo',
    hash: 'foo',
    expiresIn: 'foo',
    refreshToken: 'foo',
  });
}

function userIsLoggedOut(): void {
  spyOn(SSOConectorService, 'isLogged').and.returnValue(null as any);
}
