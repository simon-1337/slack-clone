import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface User {
  name: string;
  mail: string;
  password: string;
  id: string;
}

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit{

  userDoc: AngularFirestoreDocument<User>;
  userData$: Observable<User>;
  user: User;
  constructor(private auth: AuthService, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    const userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<User>(`users/${userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      console.log('Der Benutzer beim header ist', data);
      this.user = data;
    });
  }

}
