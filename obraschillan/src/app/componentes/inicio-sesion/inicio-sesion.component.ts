import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocialAuthService} from 'angularx-social-login';
import {GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {CookieService} from 'ngx-cookie-service';
import $ from 'jquery';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})

export class InicioSesionComponent implements OnInit {
  email = '';
  password = '';
  invalidLogin = false;
  tipo: any;
  formLogin: FormGroup;
  user: SocialUser;

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder, private authServiceGoogle: SocialAuthService, private cookieService: CookieService) {
    this.formLogin = this.formBuilder.group({
      correo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authServiceGoogle.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  checkLogin() {
    let form = document.querySelector('form');
    $(form).css({'filter': 'blur(25px)'});
    let progressbar = document.querySelector('.progress-line');
    $(progressbar).css({'display': '-webkit-flex'});
    let p = document.querySelector(".reset")
    let check = document.querySelector("input[type='submit'], input[type='text'],input[type='password']")
    let email = document.querySelector("input[type='text']")
    let pass = document.querySelector("input[type='password']")
    let google = document.querySelector("button")
    $(p).css({'display':'none'})
    $(check).attr('disabled', true)
    $(google).attr('disabled', true)
    this.authService.login(this.formLogin.get('correo').value, this.formLogin.get('contrasena').value).subscribe((resp: any) => {
      this.tipo = resp.type;
      if (resp.success) {
        Swal.fire({
          title: '',
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          confirmButtonColor: '#052a5d'
        }).then((result) => {
          sessionStorage.setItem('id', resp.user.id);
          sessionStorage.setItem('type', resp.type);
          this.cookieService.set(
            'token', resp.token, this.expire(), '/'
          );
          if (this.tipo.toString() == 'encargado') {
            this.router.navigate(['dashEncargado']);
          } else if (this.tipo.toString() == 'ciudadano') {
            this.router.navigate(['dash_Ciudadano']);
          } else if (this.tipo.toString() == 'finanzas') {
            this.router.navigate(['dashFinanzas']);
          }
        });
      }
    }, err => {
      console.log(err);
      if (err.error) {
        $(form).css({'filter': 'blur(0px)'});
        $(p).css({'display':'block'})
        $(check).attr('disabled', false)
        $(google).attr('disabled', false)
        $(email).val('')
        $(pass).val('')
        $(progressbar).css({'display': 'none'});
        this.errorSwal(err)
      }
    });
  }
  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
  expire(): Date {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 3600 * 3;
    now.setTime(expireTime);
    return now;
  }

  iniciaGoogle(): void {
    this.authServiceGoogle.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      this.authService.loginGoogle(x.idToken).subscribe((resp: any) => {
        console.log(resp);
        if (resp.success) {
          sessionStorage.setItem('id', resp.id);
          sessionStorage.setItem('type', 'ciudadano');
          this.cookieService.set(
            'token', resp.token, this.expire(), '/'
          );
          this.router.navigate(['dash_Ciudadano']);
        }
      }, err => {
        this.errorSwal(err)
      })
    });
  }

  reset() {
    this.router.navigate(['/reset_pass']);
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
      this.formLogin.get('correo').setValue('')
      this.formLogin.get('contrasena').setValue('')
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
