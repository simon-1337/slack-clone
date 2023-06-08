import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { AuthService } from '../shared/auth.service';
import { User } from 'src/models/user.class';
import { OpenThreadService } from '../shared/open-thread.service';
import { EditorComponent } from '../editor/editor.component';
import { MessageService } from '../shared/message.service';
import { SearchTermService } from '../shared/search-term.service';
import { ClassService } from "../shared/class.service";

@Component({
   selector: 'app-thread',
   templateUrl: './thread.component.html',
   styleUrls: ['./thread.component.scss']
})

export class ThreadComponent implements OnInit, OnChanges {

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
   filterallAnswers: { id: string, message: string, user: string, timestamp: number, imagePath: string }[] = [];


   private userColl: CollectionReference<DocumentData>;
   userRef: any;
   userData$: Observable<User>;
   user: User;
   firstMessage: string; 


   constructor(private searchTerm: SearchTermService,
      private firestore: Firestore, 
      private auth: AuthService, 
      private openThreadService: OpenThreadService, 
      private messageService: MessageService,
      private classService: ClassService) {
      this.coll = collection(this.firestore, 'channels');
   }


   ngOnInit(): void {
      this.getChannel();
      this.getMessage();
      this.getUser();
      this.getAnswers()

      this.searchTerm.searchTermChange.subscribe((searchTerm: string) => {
         this.onSearchTermChange(searchTerm);
         
      });
   }


   ngOnChanges(changes: SimpleChanges): void {
      if (changes['channelId'] || changes['messageId']) {
        this.getChannel();
        this.getMessage();
        this.getUser();
        this.getAnswers();
      }
    }
    

   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
      });
   }

   getMessage() {
      this.messagesColl = collection(doc(this.coll, this.channelId), 'messages');
      this.messageRef = doc(this.messagesColl, this.messageId);
      this.messages$ = docData(this.messageRef);
      this.messages$.subscribe(change => {
         this.message = new Message(change);
      });
   }

   closeThread(channelId, messageId) {
      this.openThreadService.setThreadOpened(false, channelId, messageId);
      this.classService.channelIsOpen = false;

   }


   getAnswers() {
      this.answersRef = collection(this.messageRef, 'answers');
      const answersQuery = query(this.answersRef, orderBy('timestamp'));
      this.answers$ = collectionData(answersQuery);
      this.answers$.subscribe(answers => {
        this.allAnswers = [...answers]; 
        this.allAnswers.unshift({ 
          id: this.messageId,
          message: this.message.message,
          user: this.message.user,
          timestamp: this.message.timestamp,
          imagePath: this.message.imagePath
        });
        this.updateFilteredAnswers();
      });
   }
    

   
   getUser() {
      const userId = this.auth.userUID;
      this.userColl = collection(this.firestore, 'users');
      this.userRef = doc(this.userColl, userId);
      this.userData$ = docData(this.userRef);
      this.userData$.subscribe(data => {
         this.user = data;
      });
   }


   @ViewChild('editorThread') editorThread: EditorComponent;

   onSubmit() {
      const content = this.editorThread.getContent();
      this.addAnswer(content);
      this.editorThread.clearContent()
   }

   addAnswer(content) {
      this.answersRef = collection(this.messageRef, 'answers')
      const answer = new Message;
      answer.message = content;
      answer.user = this.user.name;
      answer.imagePath = this.user.profileImageUrl;
      addDoc(this.answersRef, answer.toJSON()).then(() => {
         this.messageService.announceMessageAdded();
         this.updateFilteredAnswers();
       });
   }

   onSearchTermChange(searchTerm: string) {
      if (searchTerm.trim() === '') {
        this.filterallAnswers = this.allAnswers;
      } else {
        searchTerm = searchTerm.toLowerCase();
        this.filterallAnswers = this.allAnswers.filter(currentMessage => {
          const messageText = currentMessage.message.toLowerCase();
          const userName = currentMessage.user.toLowerCase();
          return messageText.includes(searchTerm) || userName.includes(searchTerm);
        });
      }
   }

   async updateFilteredAnswers() {
      this.filterallAnswers = [...this.allAnswers];
   }
}
