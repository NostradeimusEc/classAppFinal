import { Component, OnInit, inject } from '@angular/core';
import { Curso, User } from 'src/app/models/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as qrcode from 'qrcode-generator';

@Component({
  selector: 'app-detallecurso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.scss'],
})
export class DetalleCursoComponent implements OnInit {

    rol: 'alumno' | 'profesor' | 'admin' = null;
    loading: boolean = false;

    cursol: Curso | undefined;
    alumnosl: User[] | undefined = [];
    profesorId: string = ''; 
    cursoId: string = '';
  
    qrDataURL: string = ''; 
  
    constructor(
      private firebaseauthSvc: FirebaseauthService,
      private utilsSvc: UtilsService,
      private router: Router,
      private activeroute: ActivatedRoute
    ) { 
      this.activeroute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation()?.extras.state) {
          this.profesorId = this.router.getCurrentNavigation()?.extras.state?.['idProfesor'];
          this.cursoId = this.router.getCurrentNavigation()?.extras.state?.['idCurso'];
        }
      });
    }
  
    generateQRCode(curso: Curso) {
      const fechaActual = new Date().toISOString().split('T')[0];  // Fecha en formato YYYY-MM-DD
      const data = `${curso.id}-${curso.seccion}-${fechaActual}`;
  
      let qr = qrcode(4, 'L');
      qr.addData(data);
      qr.make();
      this.qrDataURL = qr.createDataURL(4);
    }
  
    scanQRCode() {
      // Aquí debes implementar la lógica para escanear el código QR.
      // Esto dependerá de la biblioteca o API que estés utilizando para escanear códigos QR.
    }
  
    getCursos() {
      let path = `cursos`;
  
      this.loading = true;
  
      this.firebaseauthSvc.stateUser().subscribe(user => {
        if (user) {
          // Obtener todos los cursos
          this.firebaseauthSvc.getCollectionData(path).subscribe((cursos: Curso[]) => {
            this.cursol = cursos.filter(curso => {
              // Si el usuario es un profesor, mostrar solo el curso que tiene asignado
              if (curso.profesor.uid == user.uid && this.rol == 'profesor') {
                return true;
              }
              // Si el usuario es un alumno, mostrar solo los cursos a los que está asignado
              if (curso.alumnos.some(alumno => alumno.uid == user.uid) && this.rol == 'alumno') {
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
  
    ngOnInit() {
      this.getCursos();
    }
  }