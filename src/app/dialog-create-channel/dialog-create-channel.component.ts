import { Component } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-dialog-create-channel',
  templateUrl: './dialog-create-channel.component.html',
  styleUrls: ['./dialog-create-channel.component.scss']
})
export class DialogCreateChannelComponent {

  channel: Channel = new Channel;
  
  private coll: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, public dialogRef: MatDialogRef<DialogCreateChannelComponent>) {
    this.coll = collection(this.firestore, 'channels');
  }

  saveChannel() {
    addDoc(this.coll, this.channel.toJSON()).then((docRef) => {
      // Create an empty subcollection for messages
      const messagesColl = collection(this.firestore, `channels/${docRef.id}/messages`);
      addDoc(messagesColl, {'default': 'Default document!' }); // Add an empty document to create the subcollection
      this.dialogRef.close();
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
