import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { AuthService } from '../shared/auth.service';
import { User } from 'src/models/user.class';
import { OpenThreadService } from '../shared/open-thread.service';
import { EditorComponent } from '../editor/editor.component';

@Component({
   selector: 'app-thread',
   templateUrl: './thread.component.html',
   styleUrls: ['./thread.component.scss']
})

export class ThreadComponent implements OnInit {

   @Input() threadOpened: boolean;
   @Input() channelId: any;
   @Input() messageId: any;

   private coll: CollectionReference<DocumentData>;
   docRef: any;

   channel: Channel = new Channel;
   channels$: Observable<any>;

   message: Message = new Message;
   messagesColl: any;
   messageRef: any;
   messages$: Observable<any>;

   answers: Message[] = [];
   answersRef: any;
   answers$: Observable<any>;
   allAnswers: { id: string, message: string, user: string, timestamp: number, imagePath: string }[] = [];

   private userColl: CollectionReference<DocumentData>;
   userRef: any;
   userData$: Observable<User>;
   user: User;


   constructor(private firestore: Firestore, private auth: AuthService, private openThreadService: OpenThreadService) {
      this.coll = collection(this.firestore, 'channels');
   }


   ngOnInit(): void {
      this.getChannel();
      this.getMessage();
   }

   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
      });
   }

   getMessage() {
      console.log(this.messageId);
      this.messagesColl = collection(doc(this.coll, this.channelId), 'messages');
      this.messageRef = doc(this.messagesColl, this.messageId);
      this.messages$ = docData(this.messageRef);
      this.messages$.subscribe(change => {
         this.message = new Message(change); 
      });
   }

   closeThread(channelId, messageId) {
      this.openThreadService.setThreadOpened(false, channelId, messageId);
   }


   getAnswers() {
      this.answersRef = collection(this.messageRef, 'answers')
      const answersQuery = query(this.answersRef, orderBy('timestamp'));
      this.answers$ = collectionData(answersQuery);
      this.answers$.subscribe(answers => {
         this.allAnswers = answers;
      });
   }

   // getUser() {
   //    const userId = this.auth.userUID;
   //    this.userColl = collection(this.firestore, 'users');
   //    this.userRef = doc(this.userColl, userId);
   //    this.userData$ = docData(this.userRef);
   //    this.userData$.subscribe(data => {
   //       this.user = data;
   //    });
   // }


   @ViewChild('answerEditor') editor: EditorComponent;

   onSubmit() {
      const content = this.editor.getContent();
      this.addAnswer(content);
      this.editor.clearContent()
   }

   addAnswer(content) {
      this.answersRef = collection(this.messageRef, 'answers')
      const answer = new Message;
      answer.message = content;
      answer.user = this.user.name;
      console.log(answer);
      addDoc(this.answersRef, answer.toJSON())
   }
}
