import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DetalleCursoComponent } from './backend/detalle-curso/detalle-curso.component';
import { SetCursosComponent } from './backend/set-cursos/set-cursos.component';
import { WelcomecursoComponent } from './backend/welcomecurso/welcomecurso.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


const uidAdmin = 't2Zf94C5jgWFoWzCvyTuGoLYg9S2';


const routes: Routes = [
  { path: 'set-cursos', component: SetCursosComponent, canActivate: [AdminGuard]},
  { path: 'detalle-curso', component: DetalleCursoComponent, canActivate: [AuthGuard] },
  { path: 'welcome-curso', component: WelcomecursoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth', pathMatch:'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/auth/sign-up/sign-up.module').then(m => m.SignUpPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),
    canActivate: [AuthGuard]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
