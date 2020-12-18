import {Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef} from '@angular/core';
import { IMarcador } from 'src/app/interfaces/marcador.interface';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { IReporte } from 'src/app/interfaces/reporte.interface';
import Swal from 'sweetalert2';
import {ReporteService} from '../../services/reporte.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import $ from 'jquery';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';
import {applySourceSpanToExpressionIfNeeded} from '@angular/compiler/src/output/output_ast';
import {FileChangeEvent} from '@angular/compiler-cli/src/perform_watch';
import {newArray} from '@angular/compiler/src/util';
import {empty} from 'rxjs';
import validate = WebAssembly.validate;
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-ingresar-reporte',
  templateUrl: './ingresar-reporte.component.html',
  styleUrls: ['./ingresar-reporte.component.css']
})
export class IngresarReporteComponent implements OnInit {
  @Input() User: any
  files
  filesArray: Array<File>=[]
  urls = new Array<string>()
  descripcion
  categoria:string
  direccion
  video:boolean = true;
  imagenesReporte: Array<any>=[];
  latitud:number;
  longitud:number;
  idReporte:any;
  subir = 'Subir...'
  formIngresar: FormGroup
  subido:boolean = false
  obligatorio:boolean = false
  ver:boolean = false
  ver2:boolean = false
  contain:boolean=false
  images:number
  archivos:boolean = false
  names: Array<string>=[]
  @Output() mostrar = new EventEmitter()
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options = {
    types:[],
    componentRestrictions:{country: 'CL'}
  }


  constructor(private ciudadanoService: CiudadanoService, private reporteService: ReporteService, private renderer: Renderer2, private router: Router, public modal: VerTarjetaService,
              private formBuilder: FormBuilder, private authService:AuthService) {
    this.formIngresar = this.formBuilder.group({
      descripcion:['', [Validators.required]],
      categoria:['', [Validators.required]],
      direccion:['', [Validators.required]],
      latitud:['', [Validators.required]],
      longitud:['', [Validators.required]],
      files:['', [Validators.required]]
    })

  }



  ngOnInit(): void {

  }

  public handleAddressChange(address: Address) {
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
  }

  mostrarMarcador(evento:IMarcador){
    this.obligatorio = false
    this.longitud = evento.longitud;
    this.latitud = evento.latitud;
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

  abrirModalPreview(){
    this.ver2=true
    this.modal.mostrarModal()
  }

  closeThumbnail(i){
    console.log("Posicion "+this.filesArray[i].name)
    document.getElementById(i).remove()
    this.filesArray.splice(i, 1)
    this.imagenesReporte.splice(i, 1)
    this.urls.splice(i, 1)
    if (this.filesArray.length==0){
      this.contain=false
      this.ver2=false
      this.formIngresar.get('files').setValue(null)
      this.formIngresar.get('files').updateValueAndValidity()
    }
    console.log("LARGO "+ this.filesArray.length);
    for (let j = 0; j < this.filesArray.length ; j++) {
      this.names.push(this.filesArray[j].name)
    }
    console.log("Esto tiene files: "+ this.formIngresar.get('files').value);
    this.subir = this.filesArray.length+' Imágenes'
    console.log(this.filesArray)
    console.log(this.imagenesReporte)

  }

  ingresarReporte(){
    // validacion de marcar ubicacion en el Mapa
    console.log("CATEGORÍA: "+this.categoria);
    console.log("LATITUD: "+this.latitud);
    console.log("LONGITUD: "+this.longitud);
    console.log("LARGO FILES: "+this.files);
    console.log("DIRECCIÓN: "+this.direccion);
    if(this.latitud == undefined || this.longitud == undefined || this.files == undefined || this.descripcion == undefined || this.categoria == undefined || this.direccion == undefined
      || this.direccion == '' || this.descripcion == ''){
      this.obligatorio = true
      Swal.fire({
        title: 'Error',
        text:'Todos los campos son obligatorios...',
        icon: "error",
        confirmButtonColor: "#052a5d"
      })
    }else{
      //Barra de carga
      let form =  document.querySelector('form')
      $(form).css({'filter':'blur(10px)'})
      let ingresar = document.querySelector('#ingresar')
      $(ingresar).attr('disabled', true)
      let progress = document.querySelector('.progress-line')
      $(progress).css({'display': '-webkit-flex'})
      //Capturo las imagenes en formData
      let formData = new FormData();
      if (this.filesArray.length > 0){
        for(let i=0; i<this.filesArray.length; i++) {
          formData.append('imagen', this.filesArray[i], this.filesArray[i].name)
        }

      }
      let nombreDepartamento:any;
      // Cada categoria representa a un tipo de encargado
      switch(this.categoria){
        case "Luminaria": {
          nombreDepartamento='Dirección de Obras Públicas'
          break
        }
        case "Obstrucción natural": {
          nombreDepartamento='Dirección de Obras Públicas'
          break
        }
        case "Calle sucia": {
          nombreDepartamento='Dirección de Obras Públicas'
          break
        }
        case "Tránsito": {
          nombreDepartamento='Dirección del Tránsito'
          break
        }
      }
      // Servicio que genera el reportes
      let now = new Date()
      let reporte:any = {
        idReporte: null,
        fecha: now,
        descripcion: this.descripcion,
        razones: null,
        latitud: this.latitud,
        longitud: this.longitud,
        departamento: nombreDepartamento,
        ciudadano_id: this.User.id,
        activo: true,
        direccion: this.direccion
      }
      if(this.imagenesReporte.length>0){
        this.reporteService.insertReport(reporte).subscribe((resp:any) => {
          if(resp.success == true){
            console.log(resp);
            this.idReporte = resp.id;
            console.log(nombreDepartamento)
            if(nombreDepartamento == 'Dirección de Obras Públicas'){
              console.log("Toi aki")
              reporte.idReporte = 'DOP-'+resp.id
            }else {
              console.log("Toi akix2")
              reporte.idReporte = 'DDT-'+resp.id
            }
            this.reporteService.update_Reporte(resp.id, reporte).subscribe((resp:any)=>{
              console.log('Hola'  +resp)
            })
            console.log(formData.get('image'))
            if (formData.get('imagen')!=null){
              // Servicio que guarda las imagenes en el Servidor y genera Url que luego se guarda en base de datos.
              this.ciudadanoService.uploadImages(this.idReporte,formData).subscribe( (resp2:any) => {
                console.log(resp2);
                if(resp2.success == true){
                  Swal.fire({
                    title: 'Reporte ingresado exitosamente',
                    text:'Los reportes tienen un tiempo de edición de 24 horas',
                    icon: "success",
                    confirmButtonColor: '#052a5d'
                  }).then((result) =>{
                    $(form).css({'filter':'blur(0px)'})
                    $(ingresar).attr('disabled', false)
                    $(progress).css({'display': 'none'})
                    window.location.reload(true)
                  })
                }
              }, error => {
                $(form).css({'filter':'blur(0px)'})
                $(ingresar).attr('disabled', false)
                $(progress).css({'display': 'none'})
                this.errorSwal(error)
              })
            }
          }
          console.log(resp);
        }, error => {
          $(form).css({'filter':'blur(0px)'})
          $(ingresar).attr('disabled', false)
          $(progress).css({'display': 'none'})
          this.errorSwal(error)
        })
      }else{
        this.obligatorio = true
        Swal.fire({
          title: 'Error',
          text:'Todos los campos son obligatorios...',
          icon: "error",
          confirmButtonColor: '#052a5d'
        })
        $(form).css({'filter':'blur(0px)'})
        $(ingresar).attr('disabled', false)
        $(progress).css({'display': 'none'})
      }
    }
  }

  onFileChange(e){
    console.log(e);
    console.log('dentre')
    console.log("CAMILITO  "+e.target.files.length);
    // console.log("CAMILITO  "+e.target.files[0].name);
    console.log('Largo file: '+this.imagenesReporte.length)
    // this.archivos
    if (this.imagenesReporte.length!=0){
      this.imagenesReporte = []
    }
    for (let i = 0; i < e.target.files.length ; i++) {
      // if (this.imagenesReporte.length==0){
      //   this.imagenesReporte=e.target.files
      //   break
      //   console.log("NO SIRVE");
      // }else {
      //   for (let j = 0; j < this.imagenesReporte.length ; j++) {
      //     if (this.imagenesReporte[i].name == e.target.files[i].name){
      //       this.archivos= true
      //     }
      //   }
      //   if (!this.archivos){
          this.imagenesReporte.push(e.target.files[i])
        // }
      // }

      // this.archivos = false
    }
    console.log('Largo file: '+this.imagenesReporte.length)
    this.armadoPreview()
    if (this.formIngresar.get('files')==null){
      this.formIngresar.get('files').setErrors(null)
    }
    console.log("SUBIR? "+ this.imagenesReporte.length);
    if(this.imagenesReporte.length == 0){
      this.subido = true
      this.subir = 'Subir...'
    }else if(this.imagenesReporte.length == 1){
      this.contain=true
      this.subir = this.imagenesReporte[0].name
      this.subido = false
    }else{
      this.contain=true
      this.subir = this.imagenesReporte.length+' imagenes'
      this.subido = false
    }
    console.log("TENGO ELEMENTOS: "+this.filesArray.length);
    console.log("TENGO ELEMENTOSS: "+this.imagenesReporte.length);
    console.log("TENGO ELEMENTOSSS: "+e.target.files.length);
    // if (this.filesArray.length==0){

    // }

    // if (this.filesArray.length!=0){
      this.formIngresar.get('files').setErrors(null)
    // }
  }

  reload(){
    window.location.reload(true)
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

  armadoPreview(){
    console.log()
    this.urls=[]
    if (this.imagenesReporte.length!=0){
      this.filesArray=[]
    }
    for (let i = 0; i < this.imagenesReporte.length ; i++) {

        this.filesArray.push(this.imagenesReporte[i])

      let reader = new FileReader()
      reader.onload = (e:any) =>{
        this.urls.push(e.target.result)
      }
      console.log(this.filesArray)
      console.log("POTO");
      reader.readAsDataURL(this.imagenesReporte[i])
    }

  }
  //
  // createThumbnail(file, iterator){
  //   console.log("CACUCA")
  //   // var div1 = document.createElement('div')
  //   // div1.classList.add('card')
  //   // var div2 = document.createElement('div')
  //   // div2.classList.add('card-body')
  //   var thumbnail = this.renderer.createElement('div')
  //   this.renderer.addClass(thumbnail, 'thumbnail')
  //   this.renderer.setAttribute(thumbnail, 'style', 'background-image: url(${URL.createObjectURL(file[iterator])})')
  //   //thumbnail.setAttribute('style', `background-image: url(${URL.createObjectURL(file[iterator])})`)
  //  this.renderer.appendChild(this.preview.nativeElement, thumbnail)
  //   // var padre = document.querySelector('#hola')
  //   // padre.appendChild(div1)
  //   // div1.appendChild(div2)
  //   // div2.appendChild(thumbnail)
  //   // console.log("CACUCA2")
  // }



  changeIcon(event){
    let selected = document.querySelector('#select')
    $(selected).css({'background-repeat':'no-repeat'})
    $(selected).css({'background-position':'95% 0%'})
    switch(event.categoria){
      case 'Luminaria':
        $(selected).css({'background-image':"url('assets/luminaria.png')"})
        break;
      case 'Tránsito':
        $(selected).css({'background-image':"url('assets/transito.png')"})
        break;
      case 'Obstrucción natural':
        $(selected).css({'background-image':"url('assets/natural.png')"})
        break;
      case 'Calle sucia' :
        $(selected).css({'background-image':"url('assets/basura.png')"})
        break;
    }

  }
}
