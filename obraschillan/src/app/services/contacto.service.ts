import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AppSettings} from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  API_ENDPOINT = AppSettings.API_ENDPOINT;
  constructor(private http:HttpClient, private router:Router) {}

  contacto(data:any){
    return this.http.post(`${this.API_ENDPOINT}/contacto`, data)
  }

}
