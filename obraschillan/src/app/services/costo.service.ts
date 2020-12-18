import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ICosto} from '../interfaces/costo.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CostoService {
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  httpOptions
  constructor(private http:HttpClient, private router:Router, private authService:AuthService, private cookieService:CookieService ) { }

  getByProp(id:string):Observable<ICosto[]>{
    this.buildHeader()
    return this.http.get<ICosto[]>(`${this.API_ENDPOINT}/get_costos/${id}`, this.httpOptions).pipe(
      map((res:any)=>{
        console.log(id)
        console.log(res)
        return res.costos}
      )
    )
  }
  insert(costo:any){
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/new_costo`,costo,this.httpOptions)
  }
  delete(id){
    this.buildHeader()
    return this.http.delete(`${this.API_ENDPOINT}/del_costo/${id}`,this.httpOptions)
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
