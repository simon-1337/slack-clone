import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { SingInComponent } from './sing-in/sing-in.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AngularFireModule } from '@angular/fire/compat';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelComponent } from './channel/channel.component';
import { ThreadComponent } from './thread/thread.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogCreateChannelComponent } from './dialog-create-channel/dialog-create-channel.component';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    StartScreenComponent,
    LogInComponent,
    SingInComponent,
    ForgotPasswordComponent,
    VarifyEmailComponent,
    ChannelComponent,
    ThreadComponent,
    DialogCreateChannelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    FormsModule,
    AngularFireModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
