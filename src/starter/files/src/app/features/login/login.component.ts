import { Component, OnInit } from '@angular/core';
import { FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SSOConectorService } from '@wizsolucoes/ngx-wiz-sso';
import { Util } from 'src/app/shared/utils/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private sso: SSOConectorService) { }

  ngOnInit(): void { }

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
      this.sso.loginWithCredentials({
        userName: this.form.value.email,
        password: this.form.value.password,
      })
      .subscribe(
        (data) => {
          Util.windowReload();
        },
        (error) => {
        }
      );
    }   
}