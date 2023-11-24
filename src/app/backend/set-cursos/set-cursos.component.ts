import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Curso, User } from 'src/app/models/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-set-cursos',
  templateUrl: './set-cursos.component.html',
  styleUrls: ['./set-cursos.component.scss'],
})
export class SetCursosComponent implements OnInit {

  @Input() curso: Curso;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    seccion: new FormControl('', [Validators.required]),
    sala: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  })

  firebaseauthSvc = inject(FirebaseauthService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromlocalStorage('user');
    if (this.curso) this.form.setValue(this.curso);
  }

  //====== Tomar/Seleccionar Imagen =====
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Curso')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit(){
    if (this.form.valid) {

      if(this.curso) this.updateCurso();
      else this.createCurso()
    }
  }

  // ======== Crear Curso =========
  async createCurso() {
    

      let path = `users/${this.user.uid}/cursos` 

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // ======= subir la imagen y obtener la url ===========
      let dataUrl = this.form.value.image
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseauthSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseauthSvc.addDocument(path, this.form.value).then(async res => {
          
        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Curso creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
      })

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
  }

  // ======== Actualizar Curso =========
  async updateCurso() {

      let path = `users/${this.user.uid}/cursos/${this.curso.id}` 

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // ======= Si cambió la imagen, subir la nueva y obtener la url ===========
      if(this.form.value.image !== this.curso.image){
        let dataUrl = this.form.value.image
        let imagePath = await this.firebaseauthSvc.getFilePath(this.curso.image);
        let imageUrl = await this.firebaseauthSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }
      

      delete this.form.value.id

      this.firebaseauthSvc.updateDocument(path, this.form.value).then(async res => {
          
        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Curso actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
      })

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }
}