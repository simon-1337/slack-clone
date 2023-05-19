import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { CollectionReference, DocumentData, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private coll: CollectionReference<DocumentData>;
  channels$!: Observable<any>;
  allChannels: { id: string, channelName: string }[] = [];

  constructor(public dialog: MatDialog, private firestore: Firestore) {
    this.coll = collection(this.firestore, 'channels');
  }


  ngOnInit(): void {
    this.channels$ = collectionData(this.coll, { idField: 'id' });

    //To subscribe the updates -> every time something in users changes this function is called
    this.channels$.subscribe( (changes) =>  {  
    this.allChannels = changes;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {
      
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
}
