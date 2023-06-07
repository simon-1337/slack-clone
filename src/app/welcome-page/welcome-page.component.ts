import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


interface Users {
  name: string;
}

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit{
  userDoc: AngularFirestoreDocument<Users>;
  userData$: Observable<Users>;
  userId: string = '';
  name: string = '';
  

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore) {}


  ngOnInit(): void {
    this.userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<Users>(`users/${this.userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      this.name = data.name;
    });
   
  }

}
