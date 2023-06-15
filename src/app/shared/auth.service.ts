import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/storage';



export interface User {
  mail?: string;
  name?: string;
  profileImageUrl?: string;
}


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userUID: string;
  uid: string = '';

  user$: Observable<User>;

  constructor(private fireauth: AngularFireAuth, private router: Router, private snackBar: MatSnackBar, private firestore: AngularFirestore) {
    this.user$ = this.fireauth.authState as Observable<User>;
    
    // check if user is already logged in on app init
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      this.userUID = loggedInUser;
    }
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.fireauth.signInWithPopup(provider);
  }

  async signOut(): Promise<void> {
    await this.fireauth.signOut();
    
    // remove user from local storage on logout
    localStorage.removeItem('user');
  }
  
  

  // get id from the user
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
    return doc.id;
  }
  
  
  

  //login Method
  login(mail: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(mail, password).then(res => {
      this.getFirestoreUserId().then(id => {
     
        this.userUID = id;
        
        // save user to local storage on successful login
        localStorage.setItem('user', this.userUID);
        
        this.router.navigate(['/app']);
      
      });
    }).catch(err => {
      // Show the snackbar error message
      this.snackBar.open('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.', 'OK', {
        duration: 5000 
      });
      this.router.navigate(['/']);
    }).finally(() => {
      // Suppress the console error message
      console.error = () => {};
    });
  }


  //register Method
  register(mail: string, password: string, name: string) {
    this.fireauth.fetchSignInMethodsForEmail(mail).then((signInMethods) => {
      if (signInMethods && signInMethods.length > 0) {
        this.snackBar.open('Diese E-Mail ist bereits vorhanden. Bitte wählen Sie eine andere E-Mail-Adresse für eine erfolgreiche Registrierung.', 'OK', {
          duration: 3000
        });
      } else {
        this.fireauth.createUserWithEmailAndPassword(mail, password).then(res => {
          this.router.navigate(['/']);
          const user: User = {
            mail: mail,
            name: name,
            profileImageUrl: '../assets/img/avatar.png' 
          };
          this.firestore.collection('users').doc(res.user.uid).set(user).then(() => {
            console.log('Benutzer erfolgreich in der Firestore-Datenbank erstellt.');
          }).catch(error => {
            console.error('Fehler beim Erstellen des Benutzers in der Firestore-Datenbank:', error);
          });
        }).catch(err => {
          this.snackBar.open('Fehler bei der Registrierung. Bitte versuchen Sie es erneut.', 'OK', {
            duration: 3000
          });
          console.error(err);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
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