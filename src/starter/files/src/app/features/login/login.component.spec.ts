import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { of, throwError } from 'rxjs';
import { Util } from 'src/app/shared/utils/util';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let template: HTMLElement;
  let mockSSO: jasmine.SpyObj<SSOConectorService>;

  beforeEach(async () => {
    mockSSO = jasmine.createSpyObj('mockSSO', ['loginWithCredentials']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [SharedModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [{ provide: SSOConectorService, useValue: mockSSO }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    template = fixture.nativeElement;
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
      spyOn(Util, 'windowReload').and.callFake(() => {});

      component.form.controls['email'].setErrors(null);
      component.form.controls['password'].setErrors(null);

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).toHaveBeenCalledWith({
        userName: component.form.value.email,
        password: component.form.value.password,
      });
    });

    it('should not call sso loginWithCredentials when form is invalid', () => {
      // Given

      component.form.controls['email'].setErrors({ required: true });
      component.form.controls['password'].setErrors({ required: true });

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).not.toHaveBeenCalled();
    });

    it('should handle sso errors', () => {
      // Given
      mockSSO.loginWithCredentials.and.callFake(() => {
        return throwError('fake error');
      });

      spyOn(Util, 'windowReload').and.callFake(() => {});

      component.form.controls['email'].setErrors(null);
      component.form.controls['password'].setErrors(null);

      // When
      component.onSubmit();

      // Then
      expect(mockSSO.loginWithCredentials).toHaveBeenCalled();
    });
  });
});
