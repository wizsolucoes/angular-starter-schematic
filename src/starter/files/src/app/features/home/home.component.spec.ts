import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { HomeComponent } from './home.component';
import { Util } from '../../shared/utils/util';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;
  let template: HTMLElement;

  beforeEach(() => {
    mockSSO = jasmine.createSpyObj('mockSSO', ['loginWithCredentials']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: SSOConectorService, useValue: mockSSO }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
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
        spyOn(SSOConectorService, 'isLogged').and.returnValue({
          tokenType: 'foo',
          hash: 'foo',
          expiresIn: 'foo',
          refreshToken: 'foo',
        });

        // When
        fixture.detectChanges();
      });

      it('should NOT display login form', () => {
        // Then
        expect(
          template.querySelector('[data-test="login-form"]')
        ).not.toBeTruthy();
      });

      it('should display paragraph', () => {
        // Then
        expect(
          template.querySelector('[data-test="my-paragarph"]')
        ).toBeTruthy();
      });

      it('should log user in', () => {
        // Given
        mockSSO.loginWithCredentials.and.returnValue(
          of({
            tokenType: 'foo',
            hash: 'foo',
            expiresIn: 'foo',
            refreshToken: 'foo',
          })
        );

        spyOn(Util, 'windowReload').and.callFake(() => {});

        // When
        component.onSubmitLogin();

        // Then
        expect(mockSSO.loginWithCredentials).toHaveBeenCalled();
      });
    });

    describe('when user if NOT logged in', () => {
      beforeEach(() => {
        // Given
        spyOn(SSOConectorService, 'isLogged').and.returnValue(null);

        // When
        fixture.detectChanges();
      });

      it('should display login form', () => {
        // Then
        expect(template.querySelector('[data-test="login-form"]')).toBeTruthy();
      });

      it('should NOT display paragraph', () => {
        // Then
        expect(
          template.querySelector('[data-test="my-paragarph"]')
        ).not.toBeTruthy();
      });
    });
  });
});
