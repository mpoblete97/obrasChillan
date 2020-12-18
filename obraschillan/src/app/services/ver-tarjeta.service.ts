import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerTarjetaService {

  public oculto:string = ''
  public oculto2:string = ''

  constructor() { }

  ocultarModal(){
    this.oculto = '';
    this.oculto2 = '';
  }

  mostrarModal(){
    this.oculto = 'block'
  }

  mostrarModal2(){
    this.oculto2='block'
  }
}
