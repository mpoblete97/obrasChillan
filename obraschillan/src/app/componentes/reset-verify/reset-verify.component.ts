import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import $ from 'jquery'
import {CookieService} from 'ngx-cookie-service';
@Component({
  selector: 'app-reset-verify',
  templateUrl: './reset-verify.component.html',
  styleUrls: ['./reset-verify.component.css']
})
export class ResetVerifyComponent implements OnInit {
  code=''
  pass=''
  pass2=''
  formVerify:FormGroup
  formPass:FormGroup
  visible=true
  constructor(public router:Router, private authService:AuthService, private formBuilder:FormBuilder,
              private cookieService:CookieService) {
    this.formVerify = this.formBuilder.group(({
      code:['', [Validators.required]]
    }))
    this.formPass = this.formBuilder.group(({
      pass:['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,12}$')]],
      pass2:['', [Validators.required]]
    }))
  }

  ngOnInit(): void {
    if(this.cookieService.get('email')=='') {
      Swal.fire({
        title: 'Oops',
        text: 'No existen datos, intenta nuevamente',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      })
      this.router.navigate(['/reset_pass'])
    }
  }
  verify(){
    let progress = document.querySelector('#progress1')
    let form = document.querySelector('#verify')
    let verify = document.querySelector('#verify_button')
    $(progress).css({'display':'-webkit-flex'})
    $(form).css({'filter':'blur(25px)'})
    $(verify).attr('disabled', true)
    let code=this.formVerify.get('code').value
    let email = this.cookieService.get('email')
    this.authService.verify(email, code).subscribe((res:any)=>{
      if(res.success){
        this.cookieService.set('token_reset', res.token)
        Swal.fire({
          text:res.message,
          icon:'success',
          confirmButtonColor: '#052a5d'
        }).then((result)=>{
          //ir a cambiar contraseña
          $(progress).css({'display':'none'})
          $(form).css({'filter':'blur(0px)'})
          $(verify).attr('disabled', false)
          this.visible=!this.visible
        })
      }
    }, error => {
      $(progress).css({'display':'none'})
      $(form).css({'filter':'blur(0px)'})
      $(verify).attr('disabled', false)
      this.errorSwal(error, 'verify')
    })
  }
  changePass(){
    let progress = document.querySelector('#progress2')
    let form = document.querySelector('#change')
    let change = document.querySelector('#change_button')
    $(progress).css({'display':'-webkit-flex'})
    $(form).css({'filter':'blur(25px)'})
    $(change).attr('disabled', true)
    let data = {
      pass:this.formPass.get('pass2').value,
      email:this.cookieService.get('email'),
      type:this.cookieService.get('type')
    }
    return this.authService.change(data).subscribe((res:any)=>{
      if(res.success){
        Swal.fire({
          text:'Contraseña cambiada con éxito',
          icon:'success',
          confirmButtonColor: '#052a5d'
        }).then((result)=>{
          $(progress).css({'display':'none'})
          $(form).css({'filter':'blur(0px)'})
          $(change).attr('disabled', false)
          this.router.navigate(['/login'])
        })
      }
    }, error => {
      console.log(error)
      $(progress).css({'display':'none'})
      $(form).css({'filter':'blur(0px)'})
      $(change).attr('disabled', false)
      this.errorSwal(error, '')
    })
  }
  errorSwal(error:any, type:string):void{
    let code=error.status
    if(code!=403&&code!=401){
      Swal.fire({
        title:'Oops',
        text:'Ha ocurrido un error: '+error.error.message,
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result)=>{
        if(type=='verify') {
          let input = document.querySelector('.form-reset-verify input[type="text"]')
          $(input).val('')
        }
        this.router.navigate(['/reset_pass'])
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
