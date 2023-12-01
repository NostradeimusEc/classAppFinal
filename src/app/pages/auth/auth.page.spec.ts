import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthPage } from './auth.page';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/models';

/*
Prueba de creación: La primera prueba verifica que la página de autenticación se haya creado 
correctamente. Si hay algún problema con las dependencias o con el código de la página en sí, 
esta prueba fallará.

Prueba de envío del formulario: La segunda prueba verifica que el método submit funcione 
correctamente cuando el formulario es válido. Primero, se establecen valores válidos para el 
formulario. Luego, se llama al método submit y se verifica que los métodos signIn y getUserInfo 
se hayan llamado.

Prueba de obtención de información del usuario: La tercera prueba verifica que el método 
getUserInfo funcione correctamente cuando el formulario es válido. Al igual que en la prueba 
anterior, se establecen valores válidos para el formulario. Luego, se llama al método getUserInfo 
y se verifica que los métodos getDocument, saveInlocalStorage y routerlink se hayan llamado.
*/

class MockFirebaseauthService {
    signIn(user: User) {
      return Promise.resolve({ user: { uid: '123' } });
    }
  
    getDocument(path: string) {
      return Promise.resolve({ name: 'Test User' });
    }
  }
  
  class MockUtilsService {
    loading() {
      return Promise.resolve({
        present: () => Promise.resolve(),
        dismiss: () => Promise.resolve()
      });
    }
  
    presentToast(options: any) {}
  
    saveInlocalStorage(key: string, value: any) {}
  
    routerlink(path: string) {}
  }
  
  fdescribe('AuthPage', () => {
    let component: AuthPage;
    let fixture: ComponentFixture<AuthPage>;
    let firebaseauthSvc: FirebaseauthService;
    let utilsSvc: UtilsService;
  
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ AuthPage ],
        imports: [IonicModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: FirebaseauthService, useClass: MockFirebaseauthService },
          { provide: UtilsService, useClass: MockUtilsService }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AuthPage);
      component = fixture.componentInstance;
      firebaseauthSvc = TestBed.inject(FirebaseauthService);
      utilsSvc = TestBed.inject(UtilsService);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should submit if form is valid', async () => {
      spyOn(firebaseauthSvc, 'signIn').and.callThrough();
      spyOn(component, 'getUserInfo').and.callThrough();
  
      component.form.setValue({ email: 'test@test.com', password: 'password' });
      await component.submit();
  
      expect(firebaseauthSvc.signIn).toHaveBeenCalled();
      expect(component.getUserInfo).toHaveBeenCalled();
    });
  
    it('should get user info if form is valid', async () => {
      spyOn(firebaseauthSvc, 'getDocument').and.callThrough();
      spyOn(utilsSvc, 'saveInlocalStorage').and.callThrough();
      spyOn(utilsSvc, 'routerlink').and.callThrough();
  
      component.form.setValue({ email: 'test@test.com', password: 'password' });
      await component.getUserInfo('123');
  
      expect(firebaseauthSvc.getDocument).toHaveBeenCalled();
      expect(utilsSvc.saveInlocalStorage).toHaveBeenCalled();
      expect(utilsSvc.routerlink).toHaveBeenCalled();
    });
  });