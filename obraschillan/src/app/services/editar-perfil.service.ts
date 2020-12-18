import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditarPerfilService {

  public  oculto: string = ''
  public  cambiarPass: boolean = false
  public  cambiarDatos: boolean = false
  constructor() { }

  ocultarModal(){
    this.oculto = '';
  }

  mostrarModal(){
    this.oculto = 'block'
  }
}
