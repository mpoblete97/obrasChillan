import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ICosto} from '../interfaces/costo.interface';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import Swal from "sweetalert2";
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  httpOptions
  constructor(private http:HttpClient, private cookieService:CookieService, private authService:AuthService,
              private router:Router) { }

  getByProp(id:string):Observable<any>{
    this.buildHeader()
    return this.http.get<any>(`${this.API_ENDPOINT}/get_archivos/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.archivos)
    )
  }
  upload(id:string, archivos:any){
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/upload_archivo/${id}`,archivos,this.httpOptions)
  }
  delete(id){
    this.buildHeader()
    return this.http.delete(`${this.API_ENDPOINT}/del_archivo/${id}`,this.httpOptions)
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
