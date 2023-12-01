import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FirebaseauthService } from '../services/firebaseauth.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    firebaseauthSvc = inject(FirebaseauthService);
    utilsSvc = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const uidAdmin = 't2Zf94C5jgWFoWzCvyTuGoLYg9S2';
    const user = this.firebaseauthSvc.getAuth().currentUser;

    if (user && user.uid === uidAdmin) {
      return of(true);
    } else {
      return of(false);
    }
  }
  
}


