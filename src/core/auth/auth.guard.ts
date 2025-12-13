import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

interface TokenPayload {
  exp: number; // timestamp em segundos
  iat: number; // timestamp em segundos
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    const authData = sessionStorage.getItem('token');

    if(!authData) {
        this.router.navigate(['/login']);
        return false;
    }
    
    try {
    
      const token = sessionStorage.getItem('token');
      if(token){
        const decode = jwtDecode<TokenPayload>(token);
        const now = new Date();
        const expiration = new Date(decode.exp * 1000);
        if(expiration <= now) {
          this.router.navigate(['/login']);
          return false;
        }
      }

      return true; // Está autenticado e com token válido
      
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}