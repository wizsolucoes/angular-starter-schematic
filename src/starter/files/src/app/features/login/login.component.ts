import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loginErrorMessage: string | undefined;
  loginButtonMessage = 'Entrar';
  captchaResolution: string | undefined;

  constructor(
    private fb: FormBuilder,
    private sso: SSOConectorService,
    private router: Router
  ) {}

  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  get password(): AbstractControl | null {
    return this.form.get('password');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loginButtonMessage = 'Entrando';
    this.sso
      .loginWithCredentials({
        userName: this.form.value.email || '',
        password: this.form.value.password || '',
      })
      .subscribe(
        (data) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loginErrorMessage = error.error_description;
          this.loginButtonMessage = 'Entrar';
        }
      );
  }

  onCaptchaResolved(captchaResponse: string): void {
    this.captchaResolution = captchaResponse;
  }
}
