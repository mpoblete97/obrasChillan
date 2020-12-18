import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { IEncargado } from '../interfaces/encargado.interface';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  httpOptions
  constructor(private http: HttpClient, private cookieService:CookieService, private router:Router,
              private authService:AuthService) { }


  getById(id: string){
    this.buildHeader()

    return this.http.get(`${this.API_ENDPOINT}/get_encargado/${id}`,this.httpOptions);
  }

  updateEncargado(id: string, encargado: IEncargado){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/update_encargado/${id}`, encargado, this.httpOptions);
  }

  deleteEncargado(id: string, encargado: IEncargado){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/del_encargado/${id}`, encargado, this.httpOptions);
  }

  comprobarContrasenaEncargado(email: string, contrasena: string){
    this.buildHeader()
    let credenciales = {
        email: email,
        contrasena: contrasena
    }
    return this.http.post(`${this.API_ENDPOINT}/verificarConEncargado`, credenciales, this.httpOptions);
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
