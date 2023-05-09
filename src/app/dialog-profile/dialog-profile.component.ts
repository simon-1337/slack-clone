import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

interface User {
  name: string;
  mail: string;
  password: string;
  id: string;
}

@Component({
  selector: 'app-dialog-profile',
  templateUrl: './dialog-profile.component.html',
  styleUrls: ['./dialog-profile.component.scss']
})

export class DialogProfileComponent implements OnInit{
  userDoc: AngularFirestoreDocument<User>;
  userData$: Observable<User>;
  user: User;

  name: string = '';
  mail: string = '';

  selectedFile: File = null;
  fbUrl: string = '';

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogProfileComponent>, private auth: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const userId = this.auth.userUID;
    this.userDoc = this.firestore.doc<User>(`users/${userId}`);
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


  onUpload() {
    // create a random unique ID for the file
    const fileId = Math.random().toString(36).substring(2);
    const filePath = `user-profile-images/${fileId}`;

    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.selectedFile);

    // observe the percentage changes
    uploadTask.percentageChanges().subscribe(percent => {
      console.log('upload progress:', percent);
    });

    // get notified when the download URL is available
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log('File available at:', url);
          this.fbUrl = url;
        });
      })
    ).subscribe();
  }

  uploadImage() {
    // Öffnen des Dateiauswahl-Dialogs
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      // Ausgewählte Datei abrufen
      const file = (event.target as HTMLInputElement).files[0];

  
      // Datei hochladen
      const fileId = Math.random().toString(36).substring(2);
      const filePath = `user-profile-images/${fileId}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);
  
      // Fortschritt des Uploads überwachen
      uploadTask.percentageChanges().subscribe(percent => {
        console.log('upload progress:', percent);
      });
  
      // URL des herunterladbaren Bildes abrufen
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log('File available at:', url);
            this.fbUrl = url;
          });
        })
      ).subscribe();
    };
    input.click();
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files.length > 0) {
      const file = inputElement.files[0];
      // Do something with the file
    }
  }
  
  
  
  

}