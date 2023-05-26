import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EventEmitter, Output } from '@angular/core';


interface User {
  name: string;
  mail: string;
  password: string;
  id: string;
  profileImageUrl: string;
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
  userId: string = '';
  showUserName: boolean = false;

  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(public auth: AuthService, private firestore: AngularFirestore, public dialog: MatDialog, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<User>(`users/${this.userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      this.user = data;
      const storageRef = this.storage.ref(`user-profile-images/${this.userId}.jpg`);
      storageRef.getDownloadURL().subscribe(url => {
        this.user.profileImageUrl = url;
      });
    });
}

  logOut() {
    this.auth.logout();
  }

  openDialog() {
    this.dialog.open(DialogProfileComponent);
  }

  searchToComment(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();
    this.searchTermChange.emit(searchTerm);
    console.log('Der Suchbegriff lautet', searchTerm);
  }
  
}
