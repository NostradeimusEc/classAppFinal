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

  ngOnInit() {
  }

  //====== Cerrar Sesión =====

  //====== Cerrar Sesión =====
  signOut(){
    this.firebaseauthSvc.signOut();
  }

}
