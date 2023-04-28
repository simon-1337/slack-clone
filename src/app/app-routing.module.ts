import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingInComponent } from './sing-in/sing-in.component';
import { LogInComponent } from './log-in/log-in.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './varify-email/varify-email.component';

const routes: Routes = [
  {path: '', component: LogInComponent},
  {path: 'sing-in', component: SingInComponent},
  {path: 'start-screen', component: StartScreenComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'varify-email', component: VarifyEmailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
