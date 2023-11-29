import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline'},
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline'},
  ]


  router = inject(Router);
  firebaseauthSvc = inject(FirebaseauthService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event.url;
    })
  }

  user(): User{
    return this.utilsSvc.getFromlocalStorage('user');
  }

  //====== Cerrar Sesión =====
async signOut(){
  try {
    await this.firebaseauthSvc.signOut();
    // Muestra un toast de éxito
    this.utilsSvc.presentToast({
      message: 'Sesión finalizada con éxito',
      duration: 3000,
      color: 'success',
      position: 'middle'
    });
    // Recarga la página
    window.location.reload();
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al cerrar la sesión', error);
  }
}


}
