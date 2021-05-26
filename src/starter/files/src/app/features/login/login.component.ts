import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loginErrorMessage: string;
  loginButtonMessage = 'Entrar';

  constructor(
    private fb: FormBuilder,
    private sso: SSOConectorService,
    private router: Router
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

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
        userName: this.form.value.email,
        password: this.form.value.password,
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
}
