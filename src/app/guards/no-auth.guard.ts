import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseauthService } from '../services/firebaseauth.service';
import { UtilsService } from '../services/utils.service';


@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseauthSvc = inject(FirebaseauthService);
  utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      return new Promise((resolve) =>{

        this.firebaseauthSvc.getAuth().onAuthStateChanged((auth) => {

          if(!auth) resolve(true);
          else{
            this.utilsSvc.routerlink('/main/home');
            resolve(false);
          }
        })

      });

  }
  
}
