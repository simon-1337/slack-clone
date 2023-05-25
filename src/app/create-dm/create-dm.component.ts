import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { AuthService, User } from '../shared/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-dm',
  templateUrl: './create-dm.component.html',
  styleUrls: ['./create-dm.component.scss']
})
export class CreateDmComponent implements OnInit{

  private userColl: CollectionReference<DocumentData>;
  users$: Observable<any>;
  allUsers: { name: string, mail: string, password: string, profileImageUrl: string}[] = [];

  mailCurrentUser: string;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.userColl = collection(this.firestore, 'users');
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.users$ = collectionData(this.userColl)
    this.users$.subscribe( change => {
      this.allUsers = change;
    });
  }
}
