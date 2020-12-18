import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot){
    if(this.authService.isUserLoggedIn()){
      let rol = sessionStorage.getItem('type')
      if(route.data.rol != rol){
        console.log('No puede ingresar a esta ruta')
        if(rol == 'encargado'){
          this.router.navigate(['dashEncargado/perfil']);
        }else if(rol == 'finanzas'){
          this.router.navigate(['dashFinanzas/perfil']);
        }else if(rol == 'ciudadano'){
          this.router.navigate(['dashCiudadano/perfil']);
        }
        return false;
      }
      return true;
    }else{
      console.log('No se ha iniciado sesión')
      console.log(route.data.rol)
      if(route.data.rol != 'persona'){
        this.router.navigate(['login'])
        return false;
      }else{
        return true;
      }
    }
    return false;
  }
}
