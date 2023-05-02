import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore/';

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
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.minLength(6)
  ]);
 

  togglePasswordVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(private auth : AuthService, private firestore: AngularFirestore) {}

  ngOnInit(): void {

  }

  login() {
    if (this.emailFormControl.invalid) {
      alert('Please enter a valid email address');
      return;
    }

    if (this.passwordFormControl.invalid) {
      alert('Please enter a password that is at least 6 characters long');
      return;
    }

    this.auth.login(this.mail, this.password)
    this.mail = '';
    this.password = '';

   
  }

 
}
