import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './../home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let template: HTMLElement;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;
  let router: Router;

  beforeEach(async () => {
    mockSSO = jasmine.createSpyObj('mockSSO', ['loginWithCredentials']);
    const routes = [
      {
        path: 'home',
        component: HomeComponent,
      },
    ];

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [{ provide: SSOConectorService, useValue: mockSSO }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    template = fixture.nativeElement;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login form', () => {
    expect(template.querySelector('form[data-test="login"]')).toBeTruthy();

    expect(template.querySelector('input[data-test="email"]')).toBeTruthy();

    expect(template.querySelector('input[data-test="password"]')).toBeTruthy();

    expect(template.querySelector('button[data-test="submit"]')).toBeTruthy();
  });

  describe('#onSubmit', () => {
    it('should call sso loginWithCredentials when form is valid', () => {
      // Given
      mockSSO.loginWithCredentials.and.returnValue(
        of({
          expiresIn: 'foo',
          hash: 'foo',
          refreshToken: 'foo',
          tokenType: 'foo',
        })
      );

      const email = 'email';
      const password = 'password';

      spyOn(router, 'navigate');

      component.form.controls[email].setErrors(null);
      component.form.controls[password].setErrors(null);

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).toHaveBeenCalledWith({
        userName: component.form.value.email || '',
        password: component.form.value.password || '',
      });
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not call sso loginWithCredentials when form is invalid', () => {
      // Given
      const email = 'email';
      const password = 'password';

      component.form.controls[email].setErrors({ required: true });
      component.form.controls[password].setErrors({ required: true });

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).not.toHaveBeenCalled();
    });

    it('should handle sso errors', () => {
      // Given
      const email = 'email';
      const password = 'password';

      mockSSO.loginWithCredentials.and.callFake(() => {
        return throwError('fake error');
      });

      component.form.controls[email].setErrors(null);
      component.form.controls[password].setErrors(null);

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).toHaveBeenCalled();
    });
  });

  describe('captchaResolved', () => {
    it('should define captchaResolution', () => {
      // Given
      component.captchaResolution = undefined;

      // When
      component.onCaptchaResolved('any');

      // Then
      expect(component.captchaResolution).toBeTruthy();
    });
  });
});
