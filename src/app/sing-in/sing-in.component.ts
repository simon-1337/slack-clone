import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore/';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss']
})
export class SingInComponent implements OnInit {

  user = new User();

  hide = true;
  mail : string = '';
  password : string = '';
  name : string = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }


  ngOnInit(): void {

  }

  constructor(private auth : AuthService, private snackBar: MatSnackBar, private firestore: AngularFirestore) {}

  register() {
    this.user.name = this.name;
    this.user.mail = this.mail;
    this.user.password = this.password;

    this.firestore
    .collection('users')
    .add(this.user.toJSON())
    .then((result: any) => {
      console.log('Adding user finished', result);
     
    })

    if (this.emailFormControl.invalid) {
      this.snackBar.open('Please enter a valid email address', 'OK', {
        duration: 5000 // 5 seconds
      });
      return;
    }
    
    if (this.passwordFormControl.invalid) {
      this.snackBar.open('Please enter a password that is at least 6 characters long.', 'OK', {
        duration: 5000 // 5 seconds
      });
      return;
    }
   
    if (this.emailFormControl.invalid) {
      this.snackBar.open('Please enter your name.', 'OK', {
        duration: 5000 // 5 seconds
      });
      return;
    }

    this.auth.register(this.mail, this.password);
    this.mail = '';
    this.password = '';
    this.name = '';
  }


  // onSubmit(event) {
  //   event.preventDefault();
  //   this. register();

  // }
}
