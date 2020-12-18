import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ICiudadano } from "../interfaces/ciudadano.interface";
import {map} from "rxjs/operators";
import { AppSettings } from './../app.settings';
import Swal from "sweetalert2";
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_ENDPOINT = AppSettings.API_ENDPOINT;
  correo = ''
  httpOptions
  constructor(private http: HttpClient, private cookieService:CookieService,
              private router:Router) { }

  login(email: string, contrasena:string){
    let login = {
      email: email,
      contrasena: contrasena
    }
    return this.http.post(`${this.API_ENDPOINT}/login`, login).pipe(map((res: any) => {
      return res;
    }));
  }

  register(ciudadano: ICiudadano){
    return this.http.post(`${this.API_ENDPOINT}/new_user`, ciudadano);
  }

  reset(correo:string){
    let body = {
      email:correo
    }
    return this.http.post(`${this.API_ENDPOINT}/forgot_password`, body)
  }

  verify(correo:string,code:string){
    let body = {
      email:correo,
      code:code
    }
    return this.http.post(`${this.API_ENDPOINT}/verify`, body)
  }

  change(data:any){
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/change_pass`, data, this.httpOptions)
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('id');
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('type');
    this.cookieService.deleteAll('token', '/');
  }

  public loginGoogle(idToken) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    let googleToken = { idToken:idToken };
    return this.http.post(`${this.API_ENDPOINT}/inicioGoogle`, googleToken, {headers})
  }

  buildHeader(){
    if(this.cookieService.get('token_reset')==''){
      Swal.fire({
        title:'Oops',
        text:'Los datos  han expirado, intenta nuevamente',
        icon:'error',
        confirmButtonColor: '#052a5d'
      })
      return this.router.navigate(['/reset_pass'])
    }
    var headers_object = new HttpHeaders().set('Authorization', 'Bearer '+this.cookieService.get('token_reset'))
    this.httpOptions = {
      headers: headers_object,
    }
  }
  verificaEmail (email:string){
    console.log(email)
    let body = {
      email:email
    }
    return this.http.post(`${this.API_ENDPOINT}/comprobarEmail`,body)
  }

  sendEmail(data:any){
    return this.http.post(`${this.API_ENDPOINT}/sendEmail`, data)
  }

}
