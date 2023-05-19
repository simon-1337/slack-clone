import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingInComponent } from './sing-in/sing-in.component';
import { LogInComponent } from './log-in/log-in.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';
import { ChannelComponent } from './channel/channel.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LegalsComponent } from './legals/legals.component';
import { CreateDmComponent } from './create-dm/create-dm.component';

const routes: Routes = [
  // {path: 'start-screen', component: StartScreenComponent},

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'sing-in', 
    component: SingInComponent
  },
  {
    path: 'login',
    component: LogInComponent,
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent
  },
  {
    path: 'varify-email', 
    component: VarifyEmailComponent
  },
  {
    path: 'legals', 
    component: LegalsComponent
  },
  {
    path: 'app',
    component: StartScreenComponent,
    children: [
      {
        path: '',
        component: WelcomePageComponent,
        outlet: 'chats'
      },
      {
        path: 'channel/:id',
        component: ChannelComponent,
        outlet: 'chats'
      },
      {
        path: 'createDm',
        component: CreateDmComponent,
        outlet: 'chats'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
