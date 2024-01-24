import { Injectable } from '@angular/core';
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: UsuarioService
  ) {}

  // canActivate() {
  //   if (localStorage.getItem('usuario')) {
  //     return true;
  //   }

  //   this.router.navigate(['/acceso']);
  //   return false;
  // }
  canActivate(route: ActivatedRouteSnapshot, state0: RouterStateSnapshot) {
    const currentUser = this.authenticationService.getUsuario();
    const currentRol = this.authenticationService.getRol();

    if (currentUser) {
      const roles = route.data.roles;
      console.log("... roles",roles)
      console.log("... currentRol",currentRol)
      // check if route is restricted by role route.data.roles &&
      if (roles && roles.indexOf(currentRol) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/ventas']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/acceso'], {
      queryParams: { returnUrl: state0.url }
    });
    return false;
  }
}
