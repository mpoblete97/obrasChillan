import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ContactoService} from '../../services/contacto.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import $ from 'jquery'
import Swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  nombre:''
  correo:''
  mensaje:''
  formContacto:FormGroup
  constructor(private router:Router, private contactoService:ContactoService, private formBuilder:FormBuilder,
              private authService:AuthService) {
    this.formContacto = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  send(){
    let form = document.querySelector('form')
    $(form).css({'filter':'blur(25px)'})
    let progressbar = document.querySelector('.progress-line')
    $(progressbar).css({'display':'-webkit-flex'})
    let send = document.querySelector("input [type='submit']")
    $(send).attr('disabled', true)
    let data = {
      email:this.formContacto.get('correo').value,
      nombre:this.formContacto.get('nombre').value,
      mensaje:this.formContacto.get('mensaje').value
    }
    this.contactoService.contacto(data).subscribe((res:any)=>{
      if(res.success){
        Swal.fire({
          text:'Hemos enviado tu mensaje con éxito, re responderemos a '+data.email,
          icon:'success',
          confirmButtonColor: '#052a5d'
        }).then((result)=>{
          this.router.navigate(['/home'])
        })
      }
    }, error => {
      console.log(error)
      $(form).css({'filter':'blur(0px)'})
      this.errorSwal(error)
    })
  }
  errorSwal(error:any):void{
    let code=error.status
    if(code!=403&&code!=401){
      Swal.fire({
        title:'Oops',
        text:'Ha ocurrido un error: '+error.error.message,
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result)=>{
        this.router.navigate(['/home'])
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
