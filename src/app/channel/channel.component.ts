import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit{
//   channelId = '';
//   private coll: CollectionReference<DocumentData>;
//   docRef: any;
//   channels$: Observable<any>;

//   constructor(private route: ActivatedRoute, private firestore: Firestore) {
//     this.coll = collection(this.firestore, 'users');
//   }

   ngOnInit(): void {
//     this.route.paramMap.subscribe(paramMap => {
//       this.channelId = paramMap.get('id').trim();
//       this.getChannel();
//     });
   }

//   getChannel() {
//     this.docRef = doc(this.coll, this.userId);
//     this.channel$ = docData(this.docRef);
//     this.channel$.subscribe(user => {
//       // Update the local user object with the retrieved data
//       this.user = new User(user);
//     });
//   }
}
