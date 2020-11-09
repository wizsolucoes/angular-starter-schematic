import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NavComponent } from './nav.component';
import { SSOConectorService, NgxWizSSOModule } from '@wizsolucoes/ngx-wiz-sso';
import { ssoConfig } from '../../../../config/sso_config';
import { Util } from '../../../shared/utils/util';
import { fakeToken } from '../../../../testing/fakes/fake_token';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let template: HTMLElement;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;

  beforeEach(() => {
    mockSSO = jasmine.createSpyObj('mockSSO', ['logOut', 'checkLogged']);

    TestBed.configureTestingModule({
      imports: [ NgxWizSSOModule.forRoot(ssoConfig), MatToolbarModule ],
      declarations: [NavComponent],
      providers: [{ provide: SSOConectorService, useValue: mockSSO }],
    });

    mockSSO.checkLogged.and.returnValue(of(fakeToken));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    template = fixture.nativeElement;
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
          template.querySelector('[data-test="mat-toolbar"]').children.length
        ).toBe(2);
      });
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
