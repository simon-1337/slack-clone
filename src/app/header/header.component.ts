import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { SearchTermService } from '../shared/search-term.service';
import { ClassService } from '../shared/class.service';

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
  menuCollapsed: boolean = false;
  threadIsOpen: boolean = false;
  channelIsOpen: boolean = true;

  constructor(public auth: AuthService, 
    private firestore: AngularFirestore, 
    public dialog: MatDialog, 
    private searchTerm: SearchTermService, 
    public classService: ClassService) {}

  ngOnInit(): void {
    this.userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<User>(`users/${this.userId}`);
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

  searchToComment(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.trim();
    this.searchTerm.searchTermChange.emit(searchTerm);
  }
  

  // toggle() {
  //   this.classService.hideSidenavClass = !this.classService.hideSidenavClass;
  //   this.menuCollapsed = !this.menuCollapsed;
  //   if (innerWidth <= 1200 && this.threadIsOpen && this.channelIsOpen) {
  //     this.threadIsOpen = false;
  //   }
  // }
  
}
