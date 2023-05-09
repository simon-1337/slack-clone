import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { EditorComponent } from '../editor/editor.component';
import { AuthService } from '../shared/auth.service';
import { User } from 'src/models/user.class';


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
   
   private userColl: CollectionReference<DocumentData>;
   userRef: any;
   userData$: Observable<User>;
   user: User;

   constructor(private route: ActivatedRoute, private firestore: Firestore, private auth: AuthService) {
      this.coll = collection(this.firestore, 'channels');
   }

   ngOnInit(): void {
      this.route.paramMap.subscribe(paramMap => {
         this.channelId = paramMap.get('id').trim();
         this.getChannel();
         this.getMessages();
         this.getUser();
      });
   }

   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
      });
   }

   getMessages() {
      this.messagesRef = collection(doc(this.coll, this.channelId), 'messages');
      this.messages$ = collectionData(this.messagesRef);
      this.messages$.subscribe(messages => {
         this.messages = messages.map(message => new Message(message));
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
      const message = new Message;
      message.message = content;
      message.user = this.user.name;
      addDoc(this.messagesRef, message.toJSON())
   }

}