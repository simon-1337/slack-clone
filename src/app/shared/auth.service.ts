import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth, private router : Router, private snackBar: MatSnackBar) { }

  //log in Method
  login(mail: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(mail,password).then( res => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['/start-screen']);

      // if (res.user?.emailVerified == true ) {
      //   this.router.navigate(['/start-screen']);
      // } else {
      //   this.router.navigate(['/varify-email']);
      // }
    }, err => {
      this.snackBar.open('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.', 'OK', {
        duration: 5000 // 5 seconds
      });
      this.router.navigate(['/']);
    })
  }

    //register Method
    register(mail: string, password: string) {
      this.fireauth.createUserWithEmailAndPassword(mail, password).then( res => {
          this.router.navigate(['/']);
          this.sendEmailForVaryfycation(res.user)
      }, err => {
          this.router.navigate(['/']);
      })
  }
  

    // sign out
    logout() {
      this.fireauth.signOut().then( () => {
        localStorage.removeItem('token');
        this.router.navigate(['/'])
      }, err => {
   
      })
    }

    // forgot password
    forgotPassword(mail: string) {
      this.fireauth.sendPasswordResetEmail(mail).then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        // alert('Somethink is wrong')
      })
    }

    // mail varifycation
    sendEmailForVaryfycation(user: any) {
      user.sendEmailVaryfycation().then((res: any) => {
        this.router.navigate(['/varify-email'])
      }, (err: any) => {
        alert('Something is wrong. Not abel to send mail to your email')
      })
    }
}
