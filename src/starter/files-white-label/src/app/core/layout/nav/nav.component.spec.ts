import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NavComponent } from './nav.component';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { SSOConectorService, NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { ssoConfig } from '../../../../config/sso_config';
import { Util } from '../../../shared/utils/util';
import { fakeToken } from '../../../../testing/fakes/fake_token';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let template: HTMLElement;
  let mockConfigService: jasmine.SpyObj<ConfigurationService>;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj('ConfigurationService', [
      'getConfig',
    ]);

    mockSSO = jasmine.createSpyObj('mockSSO', ['logOut', 'checkLogged']);

    TestBed.configureTestingModule({
      imports: [ NgxWizSSOModule.forRoot(ssoConfig), MatToolbarModule ],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handles user authentication', () => {
    beforeEach(() => {
      const data = {
        features: ['sales', 'documentation'],
      };
      mockConfigService.getConfig.and.returnValue(of(data));
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
          template.querySelector('[data-test="mat-toolbar"]').children.length
        ).toBe(5);
      });
    });

    describe('when user if NOT logged in', () => {
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

      mockConfigService.getConfig.and.returnValue(of(data));

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

      mockConfigService.getConfig.and.returnValue(of(data));

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
      mockConfigService.getConfig.and.returnValue(of(data));

      fixture.detectChanges();

      expect(component.isFeatureEnabled('sales')).toBe(false);
      expect(component.isFeatureEnabled('documentation')).toBe(true);
    });

    it('should only have a link to enabled features', () => {
      // Given
      const data = {
        features: ['documentation'],
      };
      mockConfigService.getConfig.and.returnValue(of(data));

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

      spyOn(Util, 'windowReload').and.callFake(() => {});

      // When
      component.logOut();

      // Then
      expect(mockSSO.logOut).toHaveBeenCalled();
    });
  });

  describe('a11y', () => {
    it('images should be acessible', () => {
      expect(template.querySelector('[data-test="logo-img"]')).toBeTruthy();

      const logoImage = template.querySelector(
        '[data-test="logo-img"]'
      ) as HTMLImageElement;
      expect(logoImage.alt).toEqual('logo');
    });
  });
});

// Helper funtions

function userIsLoggedIn(): void {
  spyOn(SSOConectorService, 'isLogged').and.returnValue({
    tokenType: 'foo',
    hash: 'foo',
    expiresIn: 'foo',
    refreshToken: 'foo',
  });
}

function userIsLoggedOut(): void {
  spyOn(SSOConectorService, 'isLogged').and.returnValue(null);
}
