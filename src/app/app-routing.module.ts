import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetCursosComponent } from './backend/set-cursos/set-cursos.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { map } from 'rxjs/operators';
import { DetalleCursoComponent } from './backend/detalle-curso/detalle-curso.component';

const uidAdmin = 't2Zf94C5jgWFoWzCvyTuGoLYg9S2';
const onlyAdmin = () => map( (user: any) => !!user && user.uid === uidAdmin);


const routes: Routes = [
  { path: 'set-cursos', component: SetCursosComponent},
  { path: 'detalle-curso', component: DetalleCursoComponent},
  { path: '', redirectTo: 'auth', pathMatch:'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule) //, canActivate: [NoAuthGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule) //, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
