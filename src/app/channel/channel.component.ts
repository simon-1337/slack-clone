import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';


@Component({
   selector: 'app-channel',
   templateUrl: './channel.component.html',
   styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
   channel: Channel = new Channel;
   messages: Message[] = [];
   channelId = '';
   private coll: CollectionReference<DocumentData>;
   docRef: any;
   channels$: Observable<any>;
   messages$: Observable<any>;

   constructor(private route: ActivatedRoute, private firestore: Firestore) {
      this.coll = collection(this.firestore, 'channels');
   }

   ngOnInit(): void {
      this.route.paramMap.subscribe(paramMap => {
         this.channelId = paramMap.get('id').trim();
         console.log(this.channelId)
         this.getChannel();
         this.getMessages();
      });
   }




   getChannel() {
      this.docRef = doc(this.coll, this.channelId);
      this.channels$ = docData(this.docRef);
      this.channels$.subscribe(change => {
         this.channel = new Channel(change);
         console.log(this.channel);
      });
   }

   getMessages() {
      const messagesRef = collection(doc(this.coll, this.channelId), 'messages');
      this.messages$ = collectionData(messagesRef);
      this.messages$.subscribe(messages => {
         this.messages = messages.map(message => new Message(message));
         console.log(this.messages);
      });
   }



   //TEXT EDITOR

}