import { Component, OnInit, inject } from '@angular/core';
import { SetCursosComponent } from 'src/app/backend/set-cursos/set-cursos.component';
import { Curso, User } from 'src/app/models/models';
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

  cursos: Curso[] = [];
  users: User[] = [];
  rol: 'alumno' | 'profesor' | 'admin' = null;
  loading: boolean = false;


  user(): User {
    return this.utilsSvc.getFromlocalStorage('user');
  }
  ionViewDidEnter() {
    this.getCursos();
  }

  ngOnInit() {
    this.firebaseauthSvc.stateUser().subscribe(res => {
      if (res) {
        this.getUserInf(res.uid);
        this.getCursos();
      } else {
        this.cursos = [];
      }
    });
  }

  // ======= Datos del Usuario/Rol ============
  getUserInf(uid: string) {
    let path = `users/${uid}`;
    this.firebaseauthSvc.getDocument(path).then((user: User) => {
      console.log('datos ->', user);
      if (user) {
        this.rol = user.profile
      }
    })
  }

// ========= Obtener Cursos ==========
getCursos() {
  let path = `cursos`;

  this.loading = true;

  this.firebaseauthSvc.stateUser().subscribe(user => {
    if (user) {
      // Obtener todos los cursos
      this.firebaseauthSvc.getCollectionData(path).subscribe((cursos: Curso[]) => {
        this.cursos = cursos.filter(curso => {
          // Si el usuario es un profesor, mostrar solo el curso que tiene asignado
          if (curso.profesor.uid == user.uid) {
            return true;
          }
          // Si el usuario es un alumno, mostrar solo los cursos a los que está asignado
          if (curso.alumnos.some(alumno => alumno.uid == user.uid)) {
            return true;
          }
          // Si el usuario es un admin, mostrar todos los cursos
          if (this.rol == 'admin') {
            return true;
          }
          return false;
        });
        this.loading = false;
      });
    }
  });
}


  // ===== Agregar o actualizar un curso
  async addUpdateCurso(curso?: Curso) {

    let success = await this.utilsSvc.presentModal({
      component: SetCursosComponent,
      cssClass: 'add-update-modal',
      componentProps: { curso }
    })

    if (success) this.getCursos();
  }

  //===== Confirmar eliminacion del curso =====
  async confirmDeleteCurso(curso: Curso) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Curso',
      message: '¿Quieres eliminar este curso?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteCurso(curso);
          }
        }
      ]
    });
  }

  // ======== Eliminar Curso =========
  async deleteCurso(curso: Curso) {

    let path = `cursos/${curso.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseauthSvc.getFilePath(curso.image);
    await this.firebaseauthSvc.deleteFile(imagePath);

    this.firebaseauthSvc.deleteDocument(path).then(async res => {

      this.cursos = this.cursos.filter(c => c.id !== curso.id);

      this.utilsSvc.presentToast({
        message: 'Curso eliminado exitosamente',
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

  verDetalle(curso: Curso) {
    this.utilsSvc.routerlink('/detalle-curso');
  }

}

