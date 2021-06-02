import { environment } from 'src/environments/environment';
import { LoginComponent } from './../../../features/login/login.component';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { NavComponent } from './nav.component';
import { SSOConectorService, NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { fakeToken } from '../../../../testing/fakes/fake_token';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let template: HTMLElement;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;
  let router: Router;

  beforeEach(() => {
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
      providers: [{ provide: SSOConectorService, useValue: mockSSO }],
    });

    mockSSO.checkLogged.and.returnValue(of(fakeToken));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    template = fixture.nativeElement;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handles user authentication', () => {
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
        expect(template.querySelector('[data-test="mat-toolbar"]')).toBeNull();
      });
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
    });

    it('images should be accessible', () => {
      expect(template.querySelector('[data-test="logo-img"]')).toBeTruthy();

      const logoImage = template.querySelector(
        '[data-test="logo-img"]'
      ) as HTMLImageElement;
      expect(logoImage.alt).toEqual('logo');
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
