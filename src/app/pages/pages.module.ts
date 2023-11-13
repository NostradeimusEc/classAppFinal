import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { Page404Component } from './page404/page404.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    Page404Component,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class PagesModule { }
