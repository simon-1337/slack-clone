import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';




interface Users {
  name: string;
  mail: string;
  password: string;
  profileImageUrl?: string;
}


@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})

export class DialogProfileComponent implements OnInit{
  userDoc: AngularFirestoreDocument<Users>;
  userData$: Observable<Users>;
  user: Users;

  name: string = '';
  mail: string = '';
  fbUrl: string = '';
  userId: string = '';

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogProfileComponent>, private auth: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<Users>(`users/${this.userId}`);
    this.userData$ = this.userDoc.valueChanges();
    this.userData$.subscribe(data => {
      this.user = data;
      this.name = data.name;
      this.mail = data.mail;
      
    });
  
  }
  

 
  saveData(): void {
    this.userDoc.update({
      name: this.name,
      mail: this.mail
    }).then(() => {
      console.log('Data updated successfully');
    }).catch(error => {
      console.log('Error updating data:', error);
    });
    this.dialogRef.close();
  }


  uploadImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
    
      const file = (event.target as HTMLInputElement).files[0];
      const filePath = `user-profile-images/${this.userId}.jpg`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);
    
      uploadTask.percentageChanges().subscribe(percent => {
        console.log('upload progress:', percent);
      });
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
         
            this.fbUrl = url;
            this.firestore.collection('users').doc(this.userId).update({profileImageUrl: url})
         
          });
        })
      ).subscribe();
    };
    input.click();
  }

}
