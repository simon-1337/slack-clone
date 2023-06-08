import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, getDocs, orderBy, query } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { EditorComponent } from '../editor/editor.component';
import { AuthService } from '../shared/auth.service';
import { User } from 'src/models/user.class';
import { OpenThreadService } from '../shared/open-thread.service';
import { MessageService } from '../shared/message.service';
import { SearchTermService } from '../shared/search-term.service';
import { ClassService } from '../shared/class.service';

@Component({
   selector: 'app-channel',
   templateUrl: './channel.component.html',
   styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

   private coll: CollectionReference<DocumentData>;
   docRef: any;

   channel: Channel = new Channel;
   channelId = '';
   channels$: Observable<any>;

   messages: Message[] = [];
   messagesRef: any;
   messages$: Observable<any>;
   allMessages: { id: string, message: string, user: string, timestamp: number, imagePath: string, answersCount: number }[] = [];
   filteredMessages: { id: string, message: string, user: string, timestamp: number, imagePath: string, answersCount: number }[] = [];


   answers: Message[] = [];
   answersRef: any;
   answers$: Observable<any>;

   private userColl: CollectionReference<DocumentData>;
   userRef: any;
   userData$: Observable<User>;
   user: User;

   idCurrentUser: string;

  
   constructor(private searchTerm: SearchTermService, 
      private route: ActivatedRoute, 
      private firestore: Firestore, 
      private auth: AuthService, 
      private openThreadService: OpenThreadService, 
      private messageService: MessageService,
      public classService: ClassService,
      private renderer: Renderer2) {
      this.coll = collection(this.firestore, 'channels');
   }

   ngOnInit(): void {
      this.route.paramMap.subscribe(paramMap => {
         const id = paramMap.get('id');
         if (id) {
            this.channelId = id.trim();
            this.getChannel();
            this.getMessages();
            this.getUser();
            this.messageService.messageAdded$.subscribe(() => {
               this.updateAnswersCount();
             });
         }
      });

      this.searchTerm.searchTermChange.subscribe((searchTerm: string) => {
         this.onSearchTermChange(searchTerm);
        
      });
   
   }

   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
      });
   }

   async getMessages() {
      this.messagesRef = collection(this.docRef, 'messages');
      const messagesQuery = query(this.messagesRef, orderBy('timestamp'));
      this.messages$ = collectionData(messagesQuery, { idField: 'id' });
      this.messages$.subscribe(async (changes) => {
         this.allMessages = changes;
         this.updateFilteredMessages();
         for (const message of this.allMessages) {
            const answersQuery = collection(doc(this.messagesRef, message.id), 'answers');
            const answersSnapshot = await getDocs(answersQuery);
            const answersCount = answersSnapshot.size;
            message.answersCount = answersCount;
         }
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
      addDoc(this.messagesRef, message.toJSON()).then((docRef) => {
         // Create an empty subcollection for messages
         const answersColl = collection(this.firestore, `channels/${this.channelId}/messages/${docRef.id}/answers`);
         addDoc(answersColl, { 'default': 'Default document!' }); // Add an empty document to create the subcollection)
         this.updateFilteredMessages();
      });
   }

   openThread(channelId: any, messageId: any) {
      this.openThreadService.setThreadOpened(true, channelId, messageId);
      if (innerWidth < 600) {
         this.classService.channelIsOpen = true;
         const styleElement = document.getElementById('close');
        
         styleElement.innerHTML = '.close-channel { width: 0%; }';
       }
   }

   updateAnswersCount() {
      for (const message of this.allMessages) {
        const answersQuery = collection(doc(this.messagesRef, message.id), 'answers');
        getDocs(answersQuery).then((answersSnapshot) => {
          const answersCount = answersSnapshot.size;
          message.answersCount = answersCount;
        });
      }
   }

   onSearchTermChange(searchTerm: string) {
      if (searchTerm.trim() === '') {
        this.filteredMessages = this.allMessages; // Wenn die Suchleiste leer ist, zeige alle Nachrichten an
      } else {
        searchTerm = searchTerm.toLowerCase();
        this.filteredMessages = this.allMessages.filter(message => {
          const messageText = message.message.toLowerCase();
          const userName = message.user.toLowerCase(); // Konvertiere den eingeloggten Namen zu Kleinbuchstaben
          return messageText.includes(searchTerm) || userName.includes(searchTerm); // Filtere die Nachrichten basierend auf dem Suchbegriff oder dem eingeloggten Namen
        });
      }
}
    

   async updateFilteredMessages() {
      this.filteredMessages = [...this.allMessages];
   }
    

}