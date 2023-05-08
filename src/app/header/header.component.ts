import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';

interface User {
  name: string;
  mail: string;
  password: string;
  id: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  userDoc: AngularFirestoreDocument<User>;
  userData$: Observable<User>;
  user: User;

  constructor(private auth: AuthService, private firestore: AngularFirestore, public dialog: MatDialog) {}

  ngOnInit(): void {
    const userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<User>(`users/${userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      this.user = data;
    });
  }

  logOut() {
    this.auth.logout();
  }

  openDialog() {
    this.dialog.open(DialogProfileComponent);
  }
}
