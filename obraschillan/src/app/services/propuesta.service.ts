import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {IPropuesta} from '../interfaces/propuesta.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {
  public propuestas:IPropuesta[]
  public Propuesta:IPropuesta
  API_ENDPOINT = AppSettings.API_ENDPOINT
  httpOptions
  constructor(private http:HttpClient, private authService:AuthService, private router:Router, private cookieService:CookieService) { }

  getAll():Observable<IPropuesta[]>{
    this.buildHeader()
    return this.http.get<IPropuesta[]>(`${this.API_ENDPOINT}/all_propuesta`, this.httpOptions).pipe(
      map((res:any)=>res.propuestas))
  }

  update_Propuesta(id:string, propuesta: IPropuesta){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/update_propuesta/${id}`, propuesta, this.httpOptions)
  }

  deletePropuesta(id:string, propuesta: IPropuesta){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/del_propuesta/${id}`, propuesta, this.httpOptions)
  }

  getByEncargado(id:string):Observable<IPropuesta[]>{
    this.buildHeader()
    return this.http.get<IPropuesta[]>(`${this.API_ENDPOINT}/get_by_encargado/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.propuestas))
  }
  getByReporte(id:string):Observable<IPropuesta>{
    this.buildHeader()
    return this.http.get<IPropuesta>(`${this.API_ENDPOINT}/get_by_reporte/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.propuesta))
  }
  insertPropuesta(propuesta:IPropuesta):Observable<any>{
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/new_propuesta`, propuesta, this.httpOptions)
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
