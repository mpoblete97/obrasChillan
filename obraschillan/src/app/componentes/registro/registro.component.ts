import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import $ from 'jquery'
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  //PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,12}$");
  //TOKEN_ENTERPRISE_PATTERN = Pattern.compile("^[A-Z\\d]{6,6}$");
  //RUN_PATTERN = Pattern.compile("^[0-9]{7,8}");
 // EMAIL_PATTERN =Pattern.compile("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
  formRegister: FormGroup
  constructor(private formBuilder:FormBuilder,private authService:AuthService,
              private router:Router)
  {
    this.formRegister = this.formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      email:['',[Validators.required, Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")],this.validarCorreo()],
      run:['',[Validators.required, Validators.pattern('^\\d{1,2}.\\d{3}.\\d{3}[-][0-9kK]{1}$')]],
      contrasena:['',[Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,12}$')]],
      contrasenaRepetida:['',[Validators.required]]

    })
  }

  ngOnInit(): void {

  }

  register(){
    let form = document.querySelector('form');
    $(form).css({'filter': 'blur(25px)'});
    let progressbar = document.querySelector('.progress-line');
    $(progressbar).css({'display': '-webkit-flex'});
    let inputs = document.querySelectorAll('input')
    let registrar = document.querySelector("input [type='submit']")
    $(registrar).attr('disabled', true)
    this.authService.register(this.formRegister.value).subscribe((res:any)=>{
      console.log(res.success)
      if(res.success){
        Swal.fire({
          title: 'Registrado con éxito',
          text:'Te redirigiremos a iniciar sesión',
          icon: "success",
          confirmButtonColor: '#052a5d'
        }).then(()=>{
          this.router.navigate(['login'])
        })
      }
    }, error => {
      console.log(error)
      if(error.error){
        $(form).css({'filter': 'blur(0px)'});
        $(registrar).attr('disabled', false)
        for (let i = 0; i < inputs.length; i++) {
          if($(inputs[i]).val()!='Registrarse'){
            $(inputs[i]).val('')
          }
        }
        this.errorSwal(error)
      }
    })
  }
  validarCorreo(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any} | null> => {
      let email = control.value;
      console.log("email: "+ email);
      let peticion:Observable<any>;
      peticion = this.authService.verificaEmail(email)
      return peticion.pipe(map((res:any) => {
          if(res.success){
            console.log('existe email')
            return { 'existe': true } //  email encontrado
          }
          return null
        })
      );
    };
  }

  validadContrasenasIguales(control: AbstractControl) {
    const contrasena = control.value;
    let error = null;
    if(this.formRegister.get('contrasenaNueva').value!=contrasena){
      error = {'noIgual': true }
    }
    return error;
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
