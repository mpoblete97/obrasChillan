import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {EditarPerfilService} from '../../services/editar-perfil.service';
import {  FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import {CiudadanoService} from '../../services/ciudadano.service';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {EncargadoService} from '../../services/encargado.service';
import {FinanzasService} from '../../services/finanzas.service';
import {AuthService} from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit, OnChanges {

  @Input() User: any
  userEditable:any;
  indefinido = false
  formContrasena: FormGroup
  formPerfil: FormGroup
  constructor(public modal: EditarPerfilService, private ciudadano: CiudadanoService,
              private router: Router, private encargado: EncargadoService,
              private finanzas: FinanzasService, private auth: AuthService, private formBuilder: FormBuilder) {
                this.formContrasena = this.formBuilder.group({
                contrasenaActual: ['',[Validators.required],this.validarContrasena()],
                contrasenaNueva: ['',[Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,12}$')]],
                contrasenaRep: ['',[Validators.required]],
                });
                this.formPerfil = this.formBuilder.group({
                  nuevoRun:['', [Validators.required,Validators.pattern('^\\d{1,2}.\\d{3}.\\d{3}[-][0-9kK]{1}$')]],
                  nuevoNombre:['', [Validators.required, Validators.minLength(3), Validators.pattern('^[ñA-Za-z ]*[ñA-Za-z][ñA-Za-z ]*$')]],
                  nuevoApellido:['',[Validators.required, Validators.minLength(3), Validators.pattern('^[ñA-Za-z ]*[ñA-Za-z][ñA-Za-z ]*$')]],
                  nuevoEmail:['', [Validators.required, Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]]
                })
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes:SimpleChanges): void{
    if(this.User != undefined){
      this.indefinido = true;
      this.userEditable = this.User;
      if(!this.User.contrasena){
        console.log('button desactivado')
        this.formContrasena.get('contrasenaActual').disable();
      }
      console.log(this.User)
    }

  }

  saveData(){
    if (this.modal.cambiarDatos){
      let tipoUser = sessionStorage.getItem('type')
      let peticionCambiarDatos:Observable<any>
      this.User.run = this.formPerfil.get('nuevoRun').value
      this.User.nombre = this.formPerfil.get('nuevoNombre').value
      this.User.apellido = this.formPerfil.get('nuevoApellido').value
      this.User.email = this.formPerfil.get('nuevoEmail').value
      this.actualizar(tipoUser,peticionCambiarDatos)
    this.modal.cambiarDatos = false
    } else {
      let tipoUser = sessionStorage.getItem('type')
      let peticionCambiarDatos: Observable<any>
      this.User.contrasena = this.formContrasena.get('contrasenaNueva').value
      this.actualizar(tipoUser,peticionCambiarDatos)
      this.modal.cambiarPass = false
      this.formContrasena.reset()
    }
  }

  ocultarModal(){
    window.location.reload(true)
    this.formContrasena.reset()
    this.userEditable = this.User;
    this.modal.ocultarModal()
  }

  actualizarDatos(peticion:Observable<any>){
    peticion.subscribe(res=>{
      Swal.fire({
        title: 'Actualización exitosa',
        icon: "success",
        confirmButtonColor: '#052a5d'
      });
    })
  }

  validarContrasena(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any} | null> => {
      let contrasena = control.value;
      console.log("CLAVE: "+ contrasena);
      let tipoUser = sessionStorage.getItem('type')
      let peticion:Observable<any>;
      if(tipoUser == 'encargado'){
        console.log("encargadooooooo")
        peticion = this.encargado.comprobarContrasenaEncargado(this.User.email, contrasena)
      }else if(tipoUser == 'ciudadano'){
        console.log("ciudadamooooooo")
        peticion = this.ciudadano.comprobarContrasenaCiudadano(this.User.email, contrasena)

      }else if(tipoUser == 'finanzas'){
        peticion = this.finanzas.comprobarContrasenaFinanzas(this.User.email, contrasena)
      }
      return peticion.pipe(map((res:any) => {
          if(res.success){
            return null;// LAS CONTRASEÑA ES CORRECTA
          }
          return { 'existe': true } //  CONTRASEÑA INCORRECTA
        })
      );
    };
  }
  actualizar(tipoUser:any, peticionCambiarDatos:Observable<any>){
    if(tipoUser == 'encargado'){
      console.log("encargadooooooo")
      peticionCambiarDatos = this.encargado.updateEncargado(this.User.id, this.User)
      this.actualizarDatos(peticionCambiarDatos)
    }else if(tipoUser == 'ciudadano'){
      console.log("ciudadamooooooo")
      peticionCambiarDatos = this.ciudadano.updateCiudadano(this.User.id, this.User)
      this.actualizarDatos(peticionCambiarDatos)
    }else if(tipoUser == 'finanzas'){
      console.log("finanzasssssss")
      peticionCambiarDatos = this.finanzas.updateFinanza(this.User.id, this.User)
      this.actualizarDatos(peticionCambiarDatos)
    }
  }

  deshabilitar():boolean{
    if (this.modal.cambiarDatos) {
      if (this.formPerfil.get('nuevoRun').valid && this.formPerfil.get('nuevoNombre').valid && this.formPerfil.get('nuevoEmail').valid) {
        return false
      } else {
        return true
      }
    }
  }
}
