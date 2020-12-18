import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AppSettings} from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class FotoPerfilService {
  httpOptions
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  constructor(private cookieService:CookieService, private authService:AuthService
              , private router:Router, private http:HttpClient) { }

  changePhoto(data:any, type:string, id:String){
    this.buildHeader()
    let ruta:string
    switch (type){
      case 'encargado':
        ruta = 'imagePerfilEncargado'
        break
      case 'finanzas':
        ruta = 'imagePerfilFinanzas'
        break
      case 'ciudadano':
        ruta = 'imagePerfilCiudadano'
    }
    return this.http.put(`${this.API_ENDPOINT}/${ruta}/${id}`, data, this.httpOptions)
  }


  buildHeader(){
    if(this.cookieService.get('token')==''){
      Swal.fire({
        title:'Oops',
        text:'Los datos de sesión han expirado, inicia nuevamente',
        icon:'error',
        confirmButtonColor: '#052a5d'
      })
      this.authService.logOut()
      return this.router.navigate(['/login'])
    }
    var headers_object = new HttpHeaders().set('Authorization', 'Bearer '+this.cookieService.get('token'))
    this.httpOptions = {
      headers: headers_object,
    }
  }
}
