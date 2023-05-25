import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, orderBy, query } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { EditorComponent } from '../editor/editor.component';
import { AuthService } from '../shared/auth.service';
import { User } from 'src/models/user.class';
import { OpenThreadService } from '../shared/open-thread.service';
import { where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';



@Component({
   selector: 'app-channel',
   templateUrl: './channel.component.html',
   styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

   @ViewChild('headerComponent', { static: true }) headerComponent: HeaderComponent;
   private coll: CollectionReference<DocumentData>;
   docRef: any;
   
   channel: Channel = new Channel;
   channelId = '';
   channels$: Observable<any>;

   messages: Message[] = [];
   messagesRef: any;
   messages$: Observable<any>;
   allMessages: { id: string, message: string, user: string, timestamp: number, imagePath: string }[] = [];

   answers: Message[] = [];
   answersRef: any;
   answers$: Observable<any>;
   
   private userColl: CollectionReference<DocumentData>;
   userRef: any;
   userData$: Observable<User>;
   user: User;

   searchTerm: string = '';


   constructor(private route: ActivatedRoute, private firestore: Firestore, private auth: AuthService, private openThreadService: OpenThreadService) {
      this.coll = collection(this.firestore, 'channels');
   }

   searchTermSubscription: Subscription;

   ngOnInit(): void {
      this.route.paramMap.subscribe(paramMap => {
         const id = paramMap.get('id');
         if (id) {
           this.channelId = id.trim();
           this.getChannel();
           this.getMessages();
           this.getUser();
           this.getAnswers();
         }
      });

      console.log('Suchbegriff erhalten:', this.searchTerm);
      
      if (this.headerComponent) {
      this.searchTermSubscription = this.headerComponent.searchTermChange.subscribe((searchTerm: string) => {
      
         // Weitere Aktionen basierend auf dem Suchbegriff ausführen
      });
   }
      
   }

   ngOnDestroy(): void {
      if (this.searchTermSubscription) {
        this.searchTermSubscription.unsubscribe();
      }
   }

   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
      });
   }

   getMessages() {
      this.messagesRef = collection(this.docRef, 'messages');
      let messagesQuery = query(this.messagesRef, orderBy('timestamp'));
 
      
      // Fügen Sie hier den Filter für den Suchbegriff hinzu
      if (this.searchTerm !== '') {
        messagesQuery = query(this.messagesRef, 
          where('message', '>=', this.searchTerm), 
          where('message', '<=', this.searchTerm + '\uf8ff')
        );
      }
      
      this.messages$ = collectionData(messagesQuery, { idField: 'id' });
      this.messages$.subscribe(changes => {
        this.allMessages = changes;
      });

   
   }

   getAnswers() {
      this.answersRef = collection(this.messagesRef, 'answers');
      let answersQuery = query(this.answersRef, orderBy('timestamp'));
      
      // Fügen Sie hier den Filter für den Suchbegriff hinzu
      if (this.searchTerm !== '') {
         answersQuery = query(this.answersRef, 
            where('message', '>=', this.searchTerm), 
            where('message', '<=', this.searchTerm + '\uf8ff')
         );
      }
      
      this.answers$ = collectionData(answersQuery);
      this.answers$.subscribe(answers => {
         this.answers = answers.map(answer => new Message(answer));
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


   @ViewChild('editor') editor: EditorComponent;

   onSubmit() {
      const content = this.editor.getContent();
      this.addMessage(content);
      this.editor.clearContent()
   }


   addMessage(content) {
      this.messagesRef = collection(doc(this.coll, this.channelId), 'messages');
      const message = new Message;
      message.message = content;
      message.user = this.user.name;
      message.imagePath = this.user.profileImageUrl;
      addDoc(this.messagesRef, message.toJSON()).then( (docRef) => {
         // Create an empty subcollection for messages
         const answersColl = collection(this.firestore, `channels/${this.channelId}/messages/${docRef.id}/answers`);
         addDoc(answersColl, {'default': 'Default document!' }); // Add an empty document to create the subcollection)
      });
   }

   openThread(channelId: any, messageId: any) {
      this.openThreadService.setThreadOpened(true, channelId, messageId);
   }

   updateSearchTerm(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.getMessages(); // Aktualisieren Sie die Nachrichtenliste basierend auf dem Suchbegriff
      this.getAnswers(); // Aktualisieren Sie die Antwortenliste basierend auf dem Suchbegriff
   }
  
}
