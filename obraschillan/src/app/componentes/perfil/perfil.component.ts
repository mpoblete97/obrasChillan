import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EditarPerfilService} from '../../services/editar-perfil.service';
import $ from 'jquery';
import {FotoPerfilService} from '../../services/foto-perfil.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnChanges {

  @Input() User: any;
  indefinido = false;
  depto = false;
  tipo: string;
  //Subir archivo
  file;
  imagen: File;

  constructor(private modal: EditarPerfilService, private fotoService: FotoPerfilService,
              private router:Router, private authService:AuthService) {
  }

  ngOnInit(): void {
    this.tipo = sessionStorage.getItem('type');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.User != undefined) {
      this.indefinido = true;
      if (this.User.departamento != undefined) {
        this.depto = true;
      }
    }
  }

  abrirModal() {
    this.modal.cambiarDatos = true;
    this.modal.cambiarPass = false;
    this.modal.mostrarModal();
  }

  abrirModalPass() {
    this.modal.cambiarPass = true;
    this.modal.cambiarDatos = false;
    this.modal.mostrarModal();
  }

  onFileChange(e) {
    console.log(e);
    this.imagen = e.target.files;
    //Subir foto
    let formData = new FormData();
    formData.append('imagen', this.imagen[0], this.imagen.name);

    this.fotoService.changePhoto(formData, sessionStorage.getItem('type'),
      sessionStorage.getItem('id')).subscribe((res: any) => {
      if (res.success) {
        Swal.fire({
          text: 'La imagen ha sido cambiada con éxito',
          icon: 'success',
          confirmButtonColor: '#052a5d'
        }).then((result) => {
          window.location.reload();
        });
      }
    }, error => {
        console.log(error)
      this.errorSwal(error)
    });
  }

  upload() {
    console.log('click en imagen');
    let inputFile = document.querySelector('#customFile');
    $(inputFile).click();
  }
  errorSwal(error:any):void{
    let code=error.status
    if(code!=403&&code!=401){
      Swal.fire({
        title:'Oops',
        text:'Ha ocurrido un error: '+error.error.message,
        icon:'error',
        confirmButtonColor: '#052a5d'
      })
    }else if(code==401){
      Swal.fire({
        title:'Oops',
        text:'No tienes autorización, tu sesión será cerrada',
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result)=>{
        this.authService.logOut()
        this.router.navigate(['/login'])
      })
    }else if(code==403){
      Swal.fire({
        title:'Oops',
        text:'Tu sesión ha expirado, inicia nuevamente',
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result)=>{
        this.authService.logOut()
        this.router.navigate(['/login'])
      })
    }
  }
}
