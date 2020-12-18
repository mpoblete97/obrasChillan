import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IFinanzas} from '../interfaces/finanzas.interface';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {
  httpOptions
  API_ENDPOINT = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient, private authService:AuthService, private router:Router, private cookieService:CookieService) { }

  getById(id: string){
    this.buildHeader()
    return this.http.get(`${this.API_ENDPOINT}/get_finanza/${id}`, this.httpOptions);
  }

  updateFinanza(id: string, finanza: any){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/update_finanza/${id}`, finanza, this.httpOptions);
  }

  deleteFinanza(id: string, finanza: IFinanzas){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/del_finanza/${id}`, finanza, this.httpOptions);
  }

  comprobarContrasenaFinanzas(email: string, contrasena: string){
    this.buildHeader()
    let credenciales = {
        email: email,
        contrasena: contrasena
    }
    return this.http.post(`${this.API_ENDPOINT}/verificarConFinanzas`, credenciales, this.httpOptions);
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
