import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message.class';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss']
})
export class DirectMessagesComponent implements OnInit {
  private usersColl: CollectionReference<DocumentData>;
  usersRef: any;
  idCurrentUser: string;

  dmId: string;
  dmData$: Observable<any>

  messages: Message[] = [];
  messagesRef: any;
  messages$: Observable<any>;
  allMessages: { id: string, message: string, user: string, timestamp: number, imagePath: string, answersCount: number }[] = [];

  participantsId: string;
  participantsRef: any;
  participantData$: Observable<any>
  participantsName: string;
  participantsImage: string;

  constructor( private route: ActivatedRoute, private firestore: Firestore, private auth: AuthService) {
    this.usersColl = collection(this.firestore, 'users');
 }

 ngOnInit() {
  this.participantsName = '';
  this.participantsImage = '';
  this.idCurrentUser = this.auth.userUID;
  this.route.paramMap.subscribe(paramMap => {
    const id = paramMap.get('id');
    if (id) {
       this.dmId = id.trim();
        this.getDms();
    }
 });
 }

 async getDms() {
  this.usersRef = doc(this.usersColl, this.idCurrentUser);
  const dmColl = collection(this.usersRef, 'dms');
  const dmRef = doc(dmColl, this.dmId);
  this.dmData$ = docData(dmRef);
  this.dmData$.subscribe(data => {
    this.getOtherParticipantsId(data)
  })
 }

 getOtherParticipantsId(data) {
  data.participants.forEach((participant) => {
    if (participant !== this.idCurrentUser) {
      this.participantsId = participant;
      this.getInfoOfParticipant();
    }
  });
 }

 getInfoOfParticipant() {
  this.participantsRef = doc(this.usersColl, this.participantsId);
  this.participantData$ = docData(this.participantsRef);
  this.participantData$.subscribe(data => {
    console.log(data);
    
    this.participantsName = data.name;
    this.participantsImage = data.profileImageUrl;
  })
 }
}
