import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore/';

interface User {
  name: string;
  mail: string;
  password: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userUID: string;

  constructor(private fireauth: AngularFireAuth, private router: Router, private snackBar: MatSnackBar, private firestore: AngularFirestore) { }

  async getFirestoreUserId(): Promise<string | null> {
    const user = await this.fireauth.currentUser;
    if (!user) {
      return null;
    }
    const usersCollection = this.firestore.collection<User>('users');
    const query = usersCollection.ref.where('mail', '==', user.email).limit(1);
    const snapshot = await query.get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    const userData = doc.data();
    console.log('Der Benutzer bei shared ist', userData);
    return doc.id;
  }
  
  

  //log in Method
  login(mail: string, password: string) {
    try {
      this.fireauth.signInWithEmailAndPassword(mail, password).then(res => {
        this.getFirestoreUserId().then(id => {
          // id ist die Haupt-ID des Benutzer-Dokuments
          this.userUID = id;
          this.router.navigate(['/app']);
          console.log('Der Benutzer beim login ist', this.userUID);
        });
      }, err => {
        this.snackBar.open('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.', 'OK', {
          duration: 5000 // 5 seconds
        });
        this.router.navigate(['/']);
      });
    } catch (err) {
      // Handle the error here
      console.error(err);
    }
  }
  

  //register Method
  register(mail: string, password: string) {
    try {
      this.fireauth.createUserWithEmailAndPassword(mail, password).then(res => {
        this.router.navigate(['/']);
      }, err => {
        this.router.navigate(['/']);
      });
    } catch (err) {
      // Handle the error here
      console.error(err);
    }
  }

  // sign out
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }, err => {

    })
      .catch((error) => {
        console.log(error);
      })
  }

  // forgot password
  forgotPassword(mail: string) {
    this.fireauth.sendPasswordResetEmail(mail).then(() => {
      this.router.navigate(['/varify-email']);
    }, err => {
      // alert('Somethink is wrong')
    })
      .catch((error) => {
        console.log(error);
      })
  }

  // mail varifycation
  sendEmailForVaryfycation(user: any) {
    user.sendEmailVaryfycation().then((res: any) => {
      this.router.navigate(['/varify-email'])
    }, (err: any) => {
      alert('Something is wrong. Not abel to send mail to your email')
    })
    .catch((error) => {
      console.log(error)
    })
  }
}
