import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Alumno } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent  implements OnInit {

  alumno: Alumno = {
    uid: '',
    email: '',
    nombre: '',
    seccion: '',
    password: '',
    foto: '',
  }

  newFile: any;


  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService) { }

  async ngOnInit() {

      const uid =  await  this.firebaseauthService.getUid();
      console.log(uid);
  }


  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
}

newImageUpload(event: any){
  if (event.target.files && event.target.files[0]) {
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
         this.alumno.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
  }
}

async registrarr(){
  const credenciales = {
      email: this.alumno.email,
      password: this.alumno.password,
  };
  const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch( err =>{
        console.log('error ->', err );
  });
  const uid =  await  this.firebaseauthService.getUid();
  this.alumno.uid = uid;
  this.guardarUser();
}

async guardarUser(){
  const path = 'Alumnos';
  const name = this.alumno.nombre;
  if (this.newFile !== undefined){
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.alumno.foto = res;
  }
  this.firestoreService.createDoc(this.alumno, path, this.alumno.uid).then( res => {
    console.log('guardado con éxito');
  }).catch( error => {
  });
}


salir(){
    this.firebaseauthService.logout();
}




}
