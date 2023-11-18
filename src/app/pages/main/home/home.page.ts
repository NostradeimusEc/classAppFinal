import { Component, OnInit, inject } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseauthSvc = inject(FirebaseauthService);
  utilsSvc = inject(UtilsService);

  //user = {} as User; debo corregir esto 1:58 =======>

  ngOnInit() {
  }

  //====== Cerrar Sesión =====
  signOut(){
    this.firebaseauthSvc.signOut();
  }

  //====== Tomar/Seleccionar Imagen =====
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;
    //this.form.controls.image.setValue.(dataUrl); debo corregir esto=======>
  }

}
