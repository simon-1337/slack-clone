import { Component, OnInit,ElementRef } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ClassService } from '../shared/class.service';

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
  

  constructor(public dialog: MatDialog, private auth: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage, private elementRef: ElementRef, private classService: ClassService) {}


  ngOnInit(): void {
    this.userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<Users>(`users/${this.userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      this.name = data.name;
    });
   
  }

  closeContainer() {
    const closesElement: HTMLElement = this.elementRef.nativeElement.querySelector('.welcome-main-div');
    closesElement.style.display = 'none';
    this.classService.hideSidenavClass = true;
  }

}
