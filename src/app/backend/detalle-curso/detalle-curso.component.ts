import { Component, OnInit } from '@angular/core';
import { Curso, QRInfo, User } from 'src/app/models/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-detallecurso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.scss'],
})
export class DetalleCursoComponent implements OnInit {

  cursos: Curso[] = [];
  codigoQR: string = '';
  users: User[] = [];
  rol: 'alumno' | 'profesor' | 'admin' = null;
  loading: boolean = false;
  alumnosPresentes: User[] = [];

  constructor(
    private firebaseauthSvc: FirebaseauthService,
    private utilsSvc: UtilsService,
    private alertController: AlertController,
    private router: Router,
    private qrScanner: QRScanner
  ) {}

  ngOnInit() {
    this.firebaseauthSvc.stateUser().subscribe(res => {
      if (res) {
        let user = this.convertFirebaseUser(res);
        this.getUserInf(user.uid);
        this.getCursos();
      } else {
        this.cursos = [];
      }
    });
  }

  async generarCodigoQR(nombreCurso: string, seccionCurso: string) {
    this.loading = true;
    if (!nombreCurso || !seccionCurso) {
      console.error('Los parámetros nombreCurso y seccionCurso no pueden estar vacíos');
      this.loading = false;
      return;
    }
    // Simula un retraso en la generación del código QR
    setTimeout(() => {
      this.codigoQR = `Curso: ${nombreCurso}, Sección: ${seccionCurso}, Fecha: ${new Date().toLocaleDateString()}`;
      this.loading = false;
    }, 1300);  
  }

  scanQRCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Se escaneó algo', text);
            this.onQRScan(text);
            scanSub.unsubscribe();
          });
        } else if (status.denied) {
          console.log('El permiso de la cámara fue denegado permanentemente');
        } else {
          console.log('Permiso denegado para esta ejecución');
        }
      })
      .catch((e: any) => console.log('El error es', e));
  }

  async presentAlertConfirm(nombreCurso: string, seccionCurso: string, fecha: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `Curso: ${nombreCurso}, Sección: ${seccionCurso}, Fecha: ${fecha}. ¿Deseas ingresar a la clase?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.checkUserInFirebase();
          }
        }
      ]
    });
    await alert.present();
  }

  onQRScan(data: string) {
    let info = this.decodeQRData(data);
    this.presentAlertConfirm(info.nombreCurso, info.seccionCurso, info.fecha);

    // Añade el usuario a la lista de alumnos presentes
    let user = this.user();
    this.addAlumnoPresente(user);
  }

  decodeQRData(data: string): QRInfo {
    let info = data.split(', ').reduce((obj, item) => {
      let [key, value] = item.split(': ');
      obj[key] = value;
      return obj;
    }, {} as any);

    return info as QRInfo;
  }

  checkUserInFirebase() {
    let user = this.user();
    let path = `users/${user.uid}`;
    this.firebaseauthSvc.getDocument(path).then((user: User) => {
      if (user) {
        this.router.navigate(['/welcome-curso'], { queryParams: { curso: this.codigoQR } });
      } else {
        console.error('Primero debes iniciar sesión');
        this.router.navigate(['/auth']);
      }
    });
  }

  user(): User {
    return this.utilsSvc.getFromlocalStorage('user');
  }

  getUserInf(uid: string) {
    let path = `users/${uid}`;
    this.firebaseauthSvc.getDocument(path).then((user: User) => {
      console.log('datos ->', user);
      if (user) {
        this.rol = user.profile
      }
    })
  }

  getCursos() {
    let path = `cursos`;
    this.loading = true;
    this.firebaseauthSvc.stateUser().subscribe(user => {
      if (user) {
        this.firebaseauthSvc.getCollectionData(path).subscribe((cursos: Curso[]) => {
          this.cursos = cursos.filter(curso => this.filterCursos(curso, user));
          this.loading = false;
        });
      }
    });
  }

  filterCursos(curso: Curso, user: User): boolean {
    if (curso.profesor.uid == user.uid) {
      return true;
    }
    if (curso.alumnos.some(alumno => alumno.uid == user.uid)) {
      return true;
    }
    if (this.rol == 'admin') {
      return true;
    }
    return false;
  }

  convertFirebaseUser(user: firebase.default.User): User {
    return {
      uid: user.uid,
      email: user.email,
      password: null,
      name: user.displayName || null,
      image: user.photoURL || null,
      profile: null
    };
  }

  addAlumnoPresente(user: User) {
    // Verifica si el usuario ya está en la lista
    if (!this.alumnosPresentes.some(alumno => alumno.uid === user.uid)) {
      this.alumnosPresentes.push(user);
    }
  }
}
