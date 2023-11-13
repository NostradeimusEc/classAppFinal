import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SetCursosComponent } from './backend/set-cursos/set-cursos.component';
import { Page404Component } from './pages/page404/page404.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'set-cursos', component: SetCursosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '', component: Page404Component },
  { path: '**', redirectTo: 'page404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
