import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss']
})
export class SingInComponent implements OnInit {

  user = new User();

  hide = true;
  mail = '';
  password = '';
  name = '';


  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
   
  ]);


  togglePasswordVisibility() {
    this.hide = !this.hide;
  }


  ngOnInit(): void {

  }

  constructor(private auth : AuthService, private snackBar: MatSnackBar, private firestore: Firestore) {}

  register() {
    this.name = this.user.name;
    this.mail = this.user.mail;
    this.password = this.user.password;
  
    if (this.mail && this.name && this.password) {
      const coll = collection(this.firestore, 'users')
      addDoc(coll, this.user.toJSON()).then((docRef) => {
          const dmsColl = collection(this.firestore, `users/${docRef.id}/dms`);
          addDoc(dmsColl, {'default': 'Default document!'});
        });
    } 

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
   
    if (this.nameFormControl.invalid) {
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
