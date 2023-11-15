import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetCursosComponent } from './backend/set-cursos/set-cursos.component';


const routes: Routes = [
  { path: 'set-cursos', component: SetCursosComponent },
  { path: '', redirectTo: 'auth', pathMatch:'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
