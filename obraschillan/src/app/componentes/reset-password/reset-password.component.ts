import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import $ from 'jquery'
import {CookieService} from 'ngx-cookie-service';
import getDocumentElement from '@popperjs/core/lib/dom-utils/getDocumentElement';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  correo=''

  formReset:FormGroup

  constructor(public router:Router, private authService:AuthService, private formBuilder:FormBuilder,
  private cookieService:CookieService) {
    this.formReset = this.formBuilder.group({
      correo:['',[Validators.required,Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]]
    })

  }

  ngOnInit(): void {

  }
  send(){
    let progressbar = document.querySelector('.progress-line')
    let enviar = document.querySelector('#enviar')
    let form = document.querySelector('form')
    $(progressbar).css({'display':'-webkit-flex'})
    $(enviar).attr('disabled',true)
    $(form).css({'filter':'blur(25px)'})
    let correo=this.formReset.get('correo').value
    this.authService.reset(correo).subscribe((res:any)=>{
      if(res.success){
        console.log('Correo enviado')
        //Quedarán guardados por 10 minutos
        this.cookieService.set('email', res.data.email, this.expire(), '/')
        this.cookieService.set('type', res.data.type, this.expire(), '/')
        Swal.fire({
          text:'Hemos enviado un correo a '+correo+' \nSigue las instrucciónes allí descritas.',
          icon:'success',
          confirmButtonColor: '#052a5d'
        }).then((result)=>{
          $(progressbar).css({'display':'none'})
          $(enviar).attr('disabled',false)
          $(form).css({'filter':'blur(0px)'})
          this.router.navigate(['/reset_verify'])
        })
      }
    },error => {
      Swal.fire({
        title:'Oops',
        text:error.error.message,
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result)=>{
        let input = document.querySelector('.form-reset-pass input[type="text"]')
        $(input).val('')
        $(progressbar).css({'display':'none'})
        $(enviar).attr('disabled',false)
        $(form).css({'filter':'blur(0px)'})
      })

    })
  }
  expire():Date{
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000*600
    now.setTime(expireTime)
    return now
  }
}
