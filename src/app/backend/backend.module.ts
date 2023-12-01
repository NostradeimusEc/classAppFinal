import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleCursoComponent } from './detalle-curso/detalle-curso.component';
import { SetCursosComponent } from './set-cursos/set-cursos.component';
import { WelcomecursoComponent } from './welcomecurso/welcomecurso.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    SetCursosComponent,
    DetalleCursoComponent,
    WelcomecursoComponent  
  ],
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    FormsModule,
    SharedModule
  ]
})
export class BackendModule { }
