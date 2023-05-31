import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData, doc, docData, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from '../shared/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { Dm } from 'src/models/dm.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-dm',
  templateUrl: './create-dm.component.html',
  styleUrls: ['./create-dm.component.scss']
})
export class CreateDmComponent implements OnInit {

  private userColl: CollectionReference<DocumentData>;
  users$: Observable<any>;
  allUsers: { id: string, name: string, mail: string, password: string, profileImageUrl: string }[] = [];

  currentUser: User;
  userRef: any;
  userData$: Observable<User>;
  userId: string;

  receivingRef: any;

  chat: Dm = new Dm;
  existingChatId: string;

  constructor(private firestore: Firestore, private auth: AuthService, private router: Router) {
    this.userColl = collection(this.firestore, 'users');
  }

  ngOnInit() {
    this.getCurrentUser();
    this.getUsers();
  }

  getUsers() {
    this.users$ = collectionData(this.userColl, { idField: 'id' })
    this.users$.subscribe(change => {
      this.allUsers = change;
    });
  }

  getCurrentUser() {
    this.userId = this.auth.userUID;
    this.userColl = collection(this.firestore, 'users');
    this.userRef = doc(this.userColl, this.userId);
    this.userData$ = docData(this.userRef);
    this.userData$.subscribe(data => {
      this.currentUser = data;
    });
  }

  async startChat(recipientUserId: string) {
    const exists = await this.checkExistingChat(recipientUserId)
    if (exists) {
      this.redirectToChat(this.existingChatId);
    } else {
      this.fillDmObject(recipientUserId);
      this.addDmDocumentToCurrentUser()
        .then((docRef) => {
          const documentId = docRef.id;
          this.addDmDocumentToReceivingUser(recipientUserId);
          this.redirectToChat(documentId);
        });
    }
  }

  async checkExistingChat(recipientUserId: string) {
    const currentUserDms = collection(this.userRef, 'dms');
    const dmQuery = query(currentUserDms, where('participants', 'array-contains', recipientUserId));
    const querySnapshot = await getDocs(dmQuery); 
    if (!querySnapshot.empty) {
      console.log(querySnapshot.size);
      this.existingChatId = querySnapshot.docs[0].id;
      return true;
    } else {
      return false;
    }
  }

  fillDmObject(recipientUserId: string) {
    this.chat.participants = [this.userId, recipientUserId];
  }

  addDmDocumentToCurrentUser(): Promise<DocumentReference<DocumentData>> {
    return new Promise((resolve, reject) => {
      const dmColl = collection(this.userRef, 'dms');
      const docRef = addDoc(dmColl, this.chat.toJSON());
      resolve(docRef);
    });
  }

  addDmDocumentToReceivingUser(recipientUserId: string) {
    this.receivingRef = doc(this.userColl, recipientUserId);
    const dmColl = collection(this.receivingRef, 'dms')
    addDoc(dmColl, this.chat.toJSON());
  }

  redirectToChat(documentId: string) {
    const chatUrl = `/app/(chats:dms/${documentId})`;
    this.router.navigateByUrl(chatUrl);
  }
}
