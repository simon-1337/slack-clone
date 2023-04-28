import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss']
})
export class SingInComponent implements OnInit {

  hide = true;
  mail : string = '';
  password : string = '';
  name : string = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }


  ngOnInit(): void {

  }

  constructor(private auth : AuthService) {}

  
  register() {
    if (this.mail == '') {
      alert('Please enter your email');
      return;
    }

    if (this.password == '') {
      alert('Please enter your password');
      return;
    }

    // if (this.name == '') {
    //   alert('Please enter your name');
    //   return;
    // }


    this.auth.register(this.mail, this.password);
    this.mail = '';
    this.password = '';
   
  }
}
