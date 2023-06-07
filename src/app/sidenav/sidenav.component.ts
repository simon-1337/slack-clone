import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from '../dialog-create-channel/dialog-create-channel.component';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { ClassService } from '../shared/class.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private coll: CollectionReference<DocumentData>;
  channels$!: Observable<any>;
  allChannels: { id: string, channelName: string }[] = [];
  turnArrow: boolean = false;
  turnArrow2: boolean = false;

  private userColl: CollectionReference<DocumentData>;
  userId: string;
  userRef: any;

  users$: Observable<any>;
  allUsers: { id: string, name: string, mail: string, password: string, profileImageUrl: string }[] = [];

  dms$!: Observable<any>;
  private dmsColl: CollectionReference<DocumentData>;
  allDms: any


  constructor(public dialog: MatDialog, private firestore: Firestore, private auth: AuthService, private classService: ClassService) {
    this.coll = collection(this.firestore, 'channels');
    this.userColl = collection(this.firestore, 'users');
  }


  ngOnInit(): void {
    this.getChannels()
    this.getDms();
  }


  getChannels() {
    this.channels$ = collectionData(this.coll, { idField: 'id' });
    //To subscribe the updates -> every time something in users changes this function is called
    this.channels$.subscribe((changes) => {
      this.allChannels = changes;      
    });
  }

  getDms() {
    this.userId = this.auth.userUID;
    this.userRef = doc(this.userColl, this.userId);
    this.dmsColl = collection(this.userRef, 'dms');
    this.dms$ = collectionData(this.dmsColl, { idField: 'id' });
  
    // Fetch all users
    this.users$ = collectionData(this.userColl, { idField: 'id' });
    this.users$.subscribe(users => {
      this.allUsers = users;
  
      // Fetch DMs
      this.dms$.subscribe(changes => {
        this.allDms = changes.map(dm => {
          const otherUserId = dm.participants && dm.participants.length > 0
            ? dm.participants.find(participantId => participantId !== this.userId)
            : null;
  
          if (otherUserId) {
            const otherUser = this.allUsers.find(user => user.id === otherUserId);
            return { id: dm.id, participantName: otherUser.name, participantImage: otherUser.profileImageUrl };
          }
          return null;
        }).filter(dm => dm !== null);
  
      });
    });
  }
  
  getParticipantName(dm: any): string {
    return dm.participant?.name || '';
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateChannelComponent, {

    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  turnArrowTo() {
    this.turnArrow = !this.turnArrow;
  }

  turnArrowTo2() {
    this.turnArrow2 = !this.turnArrow2;
  }

  toggle() {
    this.classService.hideSidenavClass = !this.classService.hideSidenavClass;
  }
}
