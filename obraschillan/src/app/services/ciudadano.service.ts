import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ICiudadano } from '../interfaces/ciudadano.interface';
import { IReporte } from '../interfaces/reporte.interface';
import Swal from "sweetalert2";
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {

  API_ENDPOINT = AppSettings.API_ENDPOINT;
  httpOptions
  constructor(private http: HttpClient, private cookieService:CookieService, private router:Router,
              private authService:AuthService) { }

  getById(id: string){
    this.buildHeader()
    return this.http.get(`${this.API_ENDPOINT}/get_ciudadano/${id}`, this.httpOptions);
  }

  updateCiudadano(id: string, ciudadano: ICiudadano){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/update_ciudadano/${id}`, ciudadano, this.httpOptions);
  }

  deleteCiudadano(id: string, ciudadano: ICiudadano){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/del_ciudadano/${id}`, ciudadano, this.httpOptions);
  }

  uploadImages(id:string, files){
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/uploadImage/${id}`,files, this.httpOptions);
  }

  getByIdEncargado(id: string){
    this.buildHeader()
    return this.http.get(`${this.API_ENDPOINT}/get_encargado/${id}`, this.httpOptions);
  }

  comprobarContrasenaCiudadano(email: string, contrasena: string){
    this.buildHeader()
    let credenciales = {
        email: email,
        contrasena: contrasena
    }
    return this.http.post(`${this.API_ENDPOINT}/verificarConCiudadano`, credenciales, this.httpOptions);
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
