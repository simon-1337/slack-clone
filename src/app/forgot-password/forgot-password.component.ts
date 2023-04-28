import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  hidden = true;
  mail : string = '';
 

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
 

  togglePasswordVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(private auth : AuthService) {}

  forgotPassword() {
    this.auth.forgotPassword(this.mail),
    this.mail = '';
  }


}
