import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameComponent } from './game/game.component';
import { AuthGuard } from './_utilities/auth-guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: GameListComponent, canActivate: [AuthGuard] },
  { path: 'game/:gid', component: GameComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
