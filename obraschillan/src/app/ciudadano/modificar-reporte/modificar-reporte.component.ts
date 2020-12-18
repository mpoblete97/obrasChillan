import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IReporte} from '../../interfaces/reporte.interface';
import {ReporteService} from '../../services/reporte.service';
import {IMarcador} from '../../interfaces/marcador.interface';
import Swal from "sweetalert2";
import {AuthService} from '../../services/auth.service';
import {ImagenesInterface} from '../../interfaces/imagenes.interface';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';
import {CiudadanoService} from '../../services/ciudadano.service';
import $ from 'jquery';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {newArray} from '@angular/compiler/src/util';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Address} from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-modificar-reporte',
  templateUrl: './modificar-reporte.component.html',
  styleUrls: ['./modificar-reporte.component.css']
})
export class ModificarReporteComponent implements OnInit{
  reporte:any
  filesArray: Array<File>=[]
  urls = new Array<string>()
  files
  descripcion
  categoria
  direccion
  imagenesReporte: Array<File>=[];
  latitud:number;
  longitud:number;
  idReporte:any;
  subir = 'Subir...'
  subido:boolean = false
  ver:boolean = false
  ver2:boolean = false
  contain:boolean=false
  muestra:boolean = true
  obligatorio:boolean = false
  formModificar: FormGroup
  imagenes: ImagenesInterface[]=[]
  @Input() User: any
  @Output() mostrar = new EventEmitter()
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options = {
    types:[],
    componentRestrictions:{country: 'CL'}
  }

  constructor(private reporteService:ReporteService, public router:Router, private authService:AuthService, public modal: VerTarjetaService, public modal1: VerTarjetaService,
              private ciudadanoService: CiudadanoService, private formBuilder: FormBuilder) {
    this.formModificar = this.formBuilder.group({
      descripcion:['', [Validators.required]],
      categoria:['', [Validators.required]],
      direccion:['', [Validators.required]],
      files:['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if (this.imagenes.length>0){
      this.formModificar.get('files').disable()
    }
    this.getReporte()
  }

  public handleAddressChange(address: Address) {
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
  }

  closeThumbnail(i){
    console.log("TENGO: "+ this.imagenes.length);
    console.log("Posicion "+this.filesArray[i].name)
    document.getElementById(i).remove()
    this.filesArray.splice(i, 1)
    this.imagenesReporte.splice(i, 1)
    this.urls.splice(i, 1)
    if (this.filesArray.length==0){

      this.contain = false
      this.formModificar.get('files').setValue(null)
      this.formModificar.get('files').updateValueAndValidity()
    }

    this.subir = this.filesArray.length+' Imágenes'
    console.log(this.filesArray)
    console.log(this.imagenesReporte)

  }

  getReporte(){
    if (this.reporteService.reporte==undefined){
      this.router.navigate(['/dashCiudadano/reportes_ingresados'])
    }else {
      console.log(this.reporteService.reporte)
      this.reporte = this.reporteService.reporte
      this.descripcion = this.reporte.descripcion
      this.direccion = this.reporte.direccion
      this.latitud = this.reporte.latitud
      this.longitud = this.reporte.longitud
      this.reporteService.get_images(this.reporte.id).subscribe((res) =>{
        this.imagenes = res
      }, error =>{
        this.errorSwal(error)
      })
    }
  }

  mostrarMarcador(evento:IMarcador){
    this.obligatorio = false
    this.latitud = evento.latitud;
    this.longitud = evento.longitud;
  }

  ocultarModal(){
    this.mostrar.emit(false)
    this.modal.ocultarModal()
  }

  abrirModal(){
    this.ver = true
    this.modal.mostrarModal()
  }

  abrirModalPreview(){
    this.ver2=true
    this.modal1.mostrarModal2()
  }

  onFileChange(e){
    console.log(e);
    console.log('dentre')
    console.log(this.imagenesReporte);
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
    this.armadoPreview()
    if (this.formModificar.get('files')==null){
      this.formModificar.get('files').setErrors(null)
    }
    if(this.imagenesReporte.length == 0){
      this.subido = true
      this.subir = 'Subir...'
    }else if(this.imagenesReporte.length == 1){
      this.contain = true
      this.subir = this.imagenesReporte[0].name
      this.subido = false
    }else{
      this.contain = true
      this.subir = this.imagenesReporte.length+' imagenes'
      this.subido = false
    }
    this.formModificar.get('files').setErrors(null)
  }

  cancelar(){
    if (this.imagenes.length == 0){
      Swal.fire({
        title: 'Error',
        text:'El reporte debe tener al menos una imagen',
        icon: "error",
        confirmButtonColor: '#052a5d'
      })
    }else {
      this.router.navigate(['/dashCiudadano/reportes_ingresados'])
    }
  }

  modificarReporte(){
    if (this.formModificar.get('direccion').value!='' && this.formModificar.get('descripcion').value!=''){
      if (this.imagenesReporte==undefined){
        this.imagenesReporte = []
      }
      if (this.imagenes.length!=0 || this.imagenesReporte.length !=0){
        //Barra de carga
        console.log("1")
        let form =  document.querySelector('form')
        $(form).css({'filter':'blur(10px)'})
        let modificar = document.querySelector('#modificar')
        $(modificar).attr('disabled', true)
        let progress = document.querySelector('.progress-line')
        $(progress).css({'display':'-webkit-flex'})
        // Capturo las imagenes en formData
        let formData = new FormData();
        if (this.imagenes.length==0){
          this.formModificar.get('files').enable()
          if (this.imagenesReporte!=undefined){
            if (this.filesArray.length > 0){
              for(let i=0; i<this.imagenesReporte.length; i++) {
                formData.append('imagen', this.filesArray[i], this.filesArray[i].name)
              }
            }

          }
        }
        var nombreDepartamento:any;
        // Cada categoria representa a un tipo de encargado
        switch(this.categoria){
          case "Luminaria": {
            nombreDepartamento='Dirección de Obras Públicas'
            console.log(nombreDepartamento)
            break
          }
          case "Obstrucción natural": {
            nombreDepartamento='Dirección de Obras Públicas'
            console.log(nombreDepartamento)
            break
          }
          case "Calle sucia": {
            nombreDepartamento='Dirección de Obras Públicas'
            console.log(nombreDepartamento)
            break
          }
          case "Tránsito": {
            nombreDepartamento='Dirección del Tránsito'
            console.log(nombreDepartamento)
            break
          }
        }
        if (nombreDepartamento == 'Dirección de Obras Públicas'){
          this.reporte.idReporte = 'DOP-'+this.reporte.id
          console.log(this.reporte.idReporte)
        }else {
          this.reporte.idReporte = 'DDT-'+this.reporte.id
          console.log(this.reporte.idReporte)
        }
        console.log(nombreDepartamento)
        if (nombreDepartamento == undefined){
          nombreDepartamento = ''
        }
        this.reporte.departamento = nombreDepartamento
        this.reporte.descripcion = this.descripcion
        this.reporte.direccion = this.direccion
        console.log(this.reporte.direccion)
        this.reporte.latitud = this.latitud
        this.reporte.longitud = this.longitud
        console.log(this.reporte.departamento)
        this.reporteService.update_Reporte(this.reporte.id.toString(), this.reporte).subscribe((resp:any)=>{
          if(resp.success == true){
            if (formData.get('imagen')!=null){
              this.ciudadanoService.uploadImages(this.reporte.id,formData).subscribe( (resp2:any) => {
                console.log(resp2);
                if(resp2.success == true){
                  Swal.fire({
                    title: 'Reporte actualizado exitosamente',
                    icon: "success",
                    confirmButtonColor: '#052a5d'
                  }).then((result) =>{
                    $(form).css({'filter':'blur(0px)'})
                    $(modificar).attr('disabled', false)
                    $(progress).css({'display': 'none'})
                    window.location.reload(true)
                  })
                }
              }, error => {
                $(form).css({'filter':'blur(0px)'})
                $(modificar).attr('disabled', false)
                $(progress).css({'display': 'none'})
                this.errorSwal(error)
              })
            }
            Swal.fire({
              title: 'Reporte actualizado exitosamente',
              icon: "success",
              confirmButtonColor: '#052a5d'
            }).then((result) =>{
              this.router.navigate(['/dashCiudadano/reportes_ingresados'])
            })
          }
        }, error => {
          this.errorSwal(error)
        })
      }else {
        Swal.fire({
          title: 'Error',
          text:'Todos los campos son obligatorios...',
          icon: "error",
          confirmButtonColor: '#052a5d'
        })
      }
    }else{
      console.log("2")
      Swal.fire({
        title: 'Error',
        text:'Todos los campos son obligatorios...',
        icon: "error",
        confirmButtonColor: '#052a5d'
      })

    }
  }

  eliminarImagen(idImagen:number){
    this.reporteService.del_imagen(idImagen.toString()).subscribe((res:any) =>{
      if (res.success == true){
        Swal.fire({
          title: 'Reporte actualizado exitosamente',
          icon: "success",
          confirmButtonColor: '#052a5d'
        }).then((result) =>{
          console.log("IMAGENES: "+this.imagenes.length);
          if (this.imagenes.length==1){
            this.imagenes = []
            console.log("HOPLAAAAAAAAAAA");
            this.muestra = false
            this.formModificar.get('files').enable()
          }else {
            this.reporteService.get_images(this.reporte.id).subscribe((res) =>{
              this.imagenes = res
            }, error =>{
              this.errorSwal(error)
            })
          }
        })
      }
    }, error => {
    })
    console.log("IMAGENES 2: "+this.imagenes.length)
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
  changeIcon(event){
    let selected = document.querySelector('#categoria')
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
