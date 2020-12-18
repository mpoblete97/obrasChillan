import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { IReporte} from '../interfaces/reporte.interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ImagenesInterface} from '../interfaces/imagenes.interface';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  public reportes:IReporte[]
  public reporte:IReporte
  public reportePropuesta:IReporte
  httpOptions
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  constructor(private http:HttpClient, private cookieService:CookieService, private router:Router,
              private authService:AuthService) {}

  getAll_encargado(id:String):Observable<IReporte[]>{
    this.buildHeader()
    return this.http.get<IReporte[]>(`${this.API_ENDPOINT}/all_reportes/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.reportes))
  }

  deleteReporte(id: String, reporte:IReporte){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/del_reporte/${id}`,reporte ,this.httpOptions)
  }

  get_images(id:String):Observable<ImagenesInterface[]>{
    this.buildHeader()
    return this.http.get<ImagenesInterface[]>(`${this.API_ENDPOINT}/get_images/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.images))
  }

  del_imagen(id:String){
    this.buildHeader()
    return this.http.delete(`${this.API_ENDPOINT}/del_imagen/${id}` ,this.httpOptions)
  }

  update_Reporte(id:String, reporte:IReporte){
    this.buildHeader()
    return this.http.put(`${this.API_ENDPOINT}/update_reporte/${id}`, reporte, this.httpOptions)
  }

  get_ReporteId(id:String){
    this.buildHeader()
    return this.http.get(`${this.API_ENDPOINT}/get_reporte/${id}`, this.httpOptions).pipe(
      map((res:any)=>res)
    )
  }

  getAll_byCiudadano(id:String):Observable<IReporte[]>{
    this.buildHeader()
    return this.http.get<IReporte[]>(`${this.API_ENDPOINT}/reportes_ciudadano/${id}`, this.httpOptions).pipe(
      map((res:any)=>res.reportes))
  }

  getAll_Recepcionados():Observable<IReporte[]>{
    this.buildHeader()
    return this.http.get<IReporte[]>(`${this.API_ENDPOINT}/all_reportesRecepcionados`, this.httpOptions).pipe(
      map((res:any) => res.reportes)
    )
  }

  getAll_noRecepcionados():Observable<IReporte[]>{
    this.buildHeader()
    return this.http.get<IReporte[]>(`${this.API_ENDPOINT}/all_reportesNoRecepcionados`, this.httpOptions).pipe(
      map((res:any) => res.reportes)
    )
  }

  getAll_enProceso():Observable<IReporte[]>{
    this.buildHeader()
    return this.http.get<IReporte[]>(`${this.API_ENDPOINT}/all_reportesEnProceso`, this.httpOptions).pipe(
      map((res:any) => res.reportes)
    )
  }

  insertReport(reporte:any){
    this.buildHeader()
    return this.http.post(`${this.API_ENDPOINT}/new_reporte`, reporte, this.httpOptions);
  }
  //
  // update(reporte:any):Observable<any>{
  //   return this.http.put(`${this.API_ENDPOINT}/update_reporte/${reporte.id}`, reporte)
  // }
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


