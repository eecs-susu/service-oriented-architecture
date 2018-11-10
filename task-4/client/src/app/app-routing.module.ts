import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { IncognitoGuard } from './incognito.guard';
import { AuthGuard } from './auth.guard';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'login', component: SignInFormComponent, canActivate: [IncognitoGuard] },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/game', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
