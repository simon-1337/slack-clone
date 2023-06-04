import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message.class';
import { AuthService } from '../shared/auth.service';
import { EditorComponent } from '../editor/editor.component';
import { User } from 'src/models/user.class';
import { SearchTermService } from '../shared/search-term.service';

@Component({
  selector: 'app-direct-messages',
  templateUrl: './direct-messages.component.html',
  styleUrls: ['./direct-messages.component.scss']
})
export class DirectMessagesComponent implements OnInit {
  private usersColl: CollectionReference<DocumentData>;
  usersRef: any;
  currentUserData$: Observable<User>;
  currentUser: User;
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

  constructor(private route: ActivatedRoute, private firestore: Firestore, private auth: AuthService, private searchTerm: SearchTermService) {
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
        this.getCurrentUser();
        this.getMessages();
      }
    });

    this.searchTerm.searchTermChange.subscribe((searchTerm: string) => {
      this.onSearchTermChange(searchTerm);
    });
  }

  getMessages() {
    const dmColl = collection(this.usersRef, 'dms');
    const dmRef = doc(dmColl, this.dmId);
    this.messagesRef = collection(dmRef, 'messages');
    this.messages$ = collectionData(this.messagesRef);
    const messagesQuery = query(collection(dmRef, 'messages'), orderBy('timestamp'));
    this.messages$ = collectionData(messagesQuery);
    this.messages$.subscribe(messages => {
      this.allMessages = messages.map(message => new Message(message));
      this.messages = this.allMessages.map(message => new Message(message)); // Anfangs alle Nachrichten anzeigen
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
      this.participantsName = data.name;
      this.participantsImage = data.profileImageUrl;
    })
  }

  getCurrentUser() {
    this.currentUserData$ = docData(this.usersRef);
    this.currentUserData$.subscribe(data => {
      this.currentUser = data;
    });
  }

  @ViewChild('editor') editor: EditorComponent;

  onSubmit() {
    const content = this.editor.getContent();
    this.addMessage(content);
    this.editor.clearContent()
  }


  addMessage(content) {
    //Add the message to the sender's document
    const dmColl = collection(this.usersRef, 'dms');
    const dmRef = doc(dmColl, this.dmId);
    this.messagesRef = collection(dmRef, 'messages');
    const message = new Message;
    message.message = content;
    message.user = this.currentUser.name;
    message.imagePath = this.currentUser.profileImageUrl;
    addDoc(this.messagesRef, message.toJSON())

    // Add the message to the receiver's document
    const receiverMessagesRef = collection(this.participantsRef, 'dms', this.dmId, 'messages');
    const receiverMessage = new Message();
    receiverMessage.message = content;
    receiverMessage.user = this.currentUser.name;
    receiverMessage.imagePath = this.currentUser.profileImageUrl;
    addDoc(receiverMessagesRef, receiverMessage.toJSON());
  }

  onSearchTermChange(searchTerm: string) {
    if (searchTerm.trim() !== '') {
      const filteredMessages = this.allMessages.filter(message =>
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.messages = filteredMessages.map(message => new Message(message));
    } else {
      this.messages = this.allMessages.map(message => new Message(message));
    }
  }
  
}

