import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetCursosComponent } from './set-cursos/set-cursos.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SetCursosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule
  ]
})
export class BackendModule { }
