import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  video:boolean = true
  ver:boolean = false
  @Output() mostrar = new EventEmitter()

  constructor(public router:Router, public modal:VerTarjetaService) { }

  ngOnInit(): void {
  }

  ocultarModal(){
    this.mostrar.emit(false)
    this.video = false
    this.modal.ocultarModal()
  }

  abrirModal(){
    this.video=true
    this.ver = true
    this.modal.mostrarModal()
  }
}
