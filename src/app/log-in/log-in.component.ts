import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  hidden = true;
  mail: string = '';
  password: string = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
 

  togglePasswordVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(private auth : AuthService, private firestore: AngularFirestore, private snackBar: MatSnackBar) {}



  ngOnInit(): void {
    this.mail = '';
    this.password = '';
  }

  loginAsGuest() {
    this.mail = 'guest.user@gmx.de';
    this.password = 'guest123';
    this.auth.login(this.mail, this.password);
    this.mail = '';
    this.password = '';
    this.emailFormControl.disable();
    this.passwordFormControl.disable();
  }
  
  
  login() {
    if (this.emailFormControl.invalid) {
      this.snackBar.open('Please enter a valid email address', 'OK', {
        duration: 3000
      });
      return;
    }
  
    if (this.passwordFormControl.invalid) {
      this.snackBar.open('Please enter a password that is at least 6 characters long.', 'OK', {
        duration: 3000 
      });
      return;
    }
  
    this.auth.login(this.mail, this.password);
  
    setTimeout(() => {
      this.mail = '';
      this.password = '';
    }, 5000);
  }
  

}
