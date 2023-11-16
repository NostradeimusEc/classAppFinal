import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Curso } from 'src/app/models/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-cursos',
  templateUrl: './set-cursos.component.html',
  styleUrls: ['./set-cursos.component.scss'],
})
export class SetCursosComponent implements OnInit {

  cursos: Curso[] = [];

  newCurso: Curso;

  enableNewCurso = false;

  private path = 'Cursos/';

  newImage = '';
  newFile = ''; 

  loading: any;

  constructor(public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getCursos()
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  async guardarClase() {
    this.presentLoading();
    const path = 'Cursos';
    const name = this.newCurso.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile,path,name);
    this.newCurso.foto = res;
    this.firestoreService.createDoc(this.newCurso, this.path, this.newCurso.id).then(res => {
      this.loading.dismiss();
      this.presentToast('guardado con exito');
    }).catch(error => {
      this.presentToast('no se pudo guardar');
    });
  }

  getCursos() {
    this.firestoreService.getCollection<Curso>(this.path).subscribe(res => {
      this.cursos = res;
    });

  }

  async deleteCurso(curso: Curso) {
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea eliminar este producto',
      buttons: [
        {
          text: 'cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, curso.id).then(res => {
              this.presentToast('eliminado con exito');
              this.alertController.dismiss();
            }).catch(error => {
              this.presentToast('no se pudo geliminar');
            });;
          }
        }
      ]
    });
    await alert.present();
  }

  nuevo() {
    this.enableNewCurso = true;
    this.newCurso = {
      nombre: '',
      seccion: '',
      sala: '',
      foto: '',
      id: this.firestoreService.getId(),
    };

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg,
      duration: 2000,
      color: 'light'
    });
    toast.present();
  }


  newImageUpload(event: any){
    if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
           this.newCurso.foto = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
    }
  }


}
