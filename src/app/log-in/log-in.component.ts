import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  hidden = true;
  mail : string = '';
  password : string = '';

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

  ngOnInit(): void {

  }

  login() {
    if (this.mail == '') {
      alert('Please enter your email');
    
      return;
    }

    if (this.password == '') {
      alert('Please enter your password');
      return;
    }

    this.auth.login(this.mail, this.password);
    this.mail = '';
    this.password = '';
  }

 
}
