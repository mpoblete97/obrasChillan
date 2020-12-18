import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';
import {ReporteService} from '../../services/reporte.service';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {IReporte} from "../../interfaces/reporte.interface";
import {IPropuesta} from "../../interfaces/propuesta.interface";
import {PropuestaService} from "../../services/propuesta.service";
import {ICosto} from "../../interfaces/costo.interface";
import {CostoService} from "../../services/costo.service";
import {async} from 'rxjs/internal/scheduler/async';
import {ImagenesInterface} from "../../interfaces/imagenes.interface";
import { AuthService } from 'src/app/services/auth.service';
import {ArchivoService} from "../../services/archivo.service";
import {CookieService} from 'ngx-cookie-service';



@Component({
  selector: 'app-ver-tarjeta',
  templateUrl: './ver-tarjeta.component.html',
  styleUrls: ['./ver-tarjeta.component.css']
})
export class VerTarjetaComponent implements OnInit{

  @Input() Elemento: any
  @Input() nombre: any
  @Output() mostrar = new EventEmitter()
  Reporte: any
  Propuesta: IPropuesta
  costos: ICosto[]
  imagenes: ImagenesInterface[]=[]
  charging:boolean=true
  latitud:number
  longitud:number
  tipo:string
  // estado:string
  archivos: any
  bi_estado = 'Aceptado / Rechazado'
  constructor(public modal: VerTarjetaService, public router:Router, private reporteService: ReporteService,
              private propuestaService:PropuestaService, private costoService: CostoService,
              private authService:AuthService, private archivoService: ArchivoService, private cookieService:CookieService) { }


  ngOnInit(): void {
    this.imagenes[0] = new class implements ImagenesInterface {
      activo: boolean;
      id: number;
      reporte_id: number;
      url: string;
    }
    this.tipo = sessionStorage.getItem("type")
    if(this.nombre == 'Propuesta'){
      console.log(this.Elemento)
      this.Propuesta = this.Elemento
      this.reporteService.get_ReporteId(this.Propuesta.Reporte_id.toString()).subscribe(res=>{
        this.Reporte = res.reporte;
        this.latitud = this.Reporte.latitud
        this.longitud = this.Reporte.longitud
        // this.estado = this.Reporte.estado
        if(this.Reporte){
          if(this.Reporte.estado=='Aceptado' || this.Reporte.estado =='Rechazado'){
            this.bi_estado=this.Reporte.estado
          }
          console.log(this.Reporte)
          this.reporteService.get_images(this.Reporte.id.toString()).subscribe(res=>{
            this.imagenes = res
            this.costoService.getByProp(this.Propuesta.id.toString()).subscribe(resp =>{
              this.costos = resp;
              console.log(this.costos)
              this.charging = false
            },error => {
              this.errorSwal(error,false)
            })
          }, error => {
            this.imagenes[0].url='https://static.thenounproject.com/png/3104878-200.png'
            this.charging=false
          })
          this.archivoService.getByProp(this.Propuesta.id.toString()).subscribe(resp =>{
            this.archivos = resp
          }, error => {
            this.errorSwal(error, false)
          })
        }
      }, error => {
        this.errorSwal(error, false)
      })

    }else if(this.nombre == 'Reporte'){
      console.log("reporte")
      this.Reporte = this.Elemento
      this.reporteService.get_images(this.Reporte.id.toString()).subscribe(res=>{
        if(this.Reporte.estado=='Aceptado' || this.Reporte.estado =='Rechazado'){
          this.bi_estado=this.Reporte.estado
        }
        this.imagenes = res
        this.charging=false
      },error => {
        this.imagenes[0].url='https://static.thenounproject.com/png/3104878-200.png'
        this.charging=false
      })
    }else if (this.nombre == 'Propuesta2'){
      this.Reporte = this.Elemento
      this.latitud = this.Reporte.latitud
      this.longitud = this.Reporte.longitud
      if(this.Reporte.estado=='Aceptado' || this.Reporte.estado =='Rechazado'){
        this.bi_estado=this.Reporte.estado
      }
      this.propuestaService.getByReporte(this.Reporte.id.toString()).subscribe(resp =>{

        this.Propuesta = resp[0]
        if(this.Propuesta){
          console.log(this.Propuesta.id)
          this.costoService.getByProp(this.Propuesta.id.toString()).subscribe(resp =>{
            this.costos = resp;
            console.log(resp)
          }, error => {
            this.errorSwal(error, false)
          })
          this.archivoService.getByProp(this.Propuesta.id.toString()).subscribe(resp =>{
            this.archivos = resp
          }, error => {
            this.errorSwal(error,false)
          })
        }
        this.reporteService.get_images(this.Reporte.id.toString()).subscribe(res=>{
          this.imagenes = res
          this.charging=false
        }, error => {
          this.imagenes[0].url='https://static.thenounproject.com/png/3104878-200.png'
          this.charging=false
        })
      }, error => {
        this.errorSwal(error, false)
      })
    }
  }
  ocultarModal(){
    this.mostrar.emit(false)
    this.modal.ocultarModal()
  }

  transformDate(fecha:string):string{
    let fechita = new Date(fecha)
    let y:any = fechita.getFullYear()
    let m:any = fechita.getMonth() + 1
    let d:any = fechita.getDate()
    if(d < 10) d = '0' + d
    if(m < 10) m = '0' + m
    return `${d}-${m}-${y}`
  }

  recibir(){
    Swal.fire({
      title: '¿Está Seguro?',
      text:"Marcará el reporte como Recepcionado",
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if (result.value){
        this.Reporte.estado = "Recepcionado"
        this.Reporte.departamento=''
        this.reporteService.update_Reporte(this.Reporte.id.toString(), this.Reporte).subscribe((res:any)=>{
          if (res.success){
            let data = {
              id_ciudadano:this.Reporte.Ciudadano_id,
              estado:'Recepcionado',
              idReporte:this.Reporte.idReporte
            }
            this.authService.sendEmail(data).subscribe((res:any)=>{
              if(res.success){
                console.log(res)
              }
            }, error => {
              console.log(error)
            })
            Swal.fire({
              title: 'Perfecto',
              text:"El reporte se ha Recepcionado exitosamente",
              icon:'success',
              confirmButtonColor: '#052a5d'
            }).then((result) =>{
              window.location.reload(true)
            })
          }
        }, error => {
          this.errorSwal(error, true)
        })
      }
    })
  }

  Recepcionado(verificar:string):boolean{
    if (verificar==='Recepcionado' || verificar === 'En proceso' || verificar==='Rechazado' || verificar === 'Aceptado'){
      return false
    }else{
      return true
    }
  }

  accept(){
    Swal.fire({
      title: '¿Está Seguro?',
      text:"Marcará la propuesta como aceptada",
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if (result.value){
        this.reporteService.get_ReporteId(this.Propuesta.Reporte_id.toString()).subscribe((res:any)=>{
          console.log(res)
          if (res.success){
            res.reporte.estado = "Aceptado"
            this.reporteService.update_Reporte(res.reporte.id, res.reporte).subscribe((res2:any)=>{
              if (res2.success){
                let data = {
                  id_ciudadano:res.reporte.Ciudadano_id,
                  estado:'Aceptado',
                  idReporte:res.reporte.idReporte
                }
                this.authService.sendEmail(data).subscribe((res:any)=>{
                  if(res.success){
                    console.log(res)
                  }
                }, error => {
                  console.log(error)
                })
                Swal.fire({
                  title: 'Perfecto',
                  text:"La propuesta ha sido aceptada",
                  icon:'success',
                  confirmButtonColor: '#052a5d'
                }).then((result) =>{
                  window.location.reload(true)
                })
              }
            }, error => {
              this.errorSwal(error,true)
            })
          }
        }, error => {
          this.errorSwal(error, false)
        })
      }
    })
  }

  refuse(){
    Swal.fire({
      title: '¿Está Seguro?',
      text:"Ingrese las razones del rechazo",
      icon:'warning',
      input:'textarea',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText:'Confirmar',
      inputValidator: (inputValue)=> {
        return new Promise((resolve) => {
          console.log(inputValue+ 'Holita')
          if (inputValue && inputValue.length>0){
            this.Propuesta.razones = inputValue+''
            if (this.Propuesta.razones.length != 0){
              this.reporteService.get_ReporteId(this.Propuesta.Reporte_id.toString()).subscribe((res:any)=>{
                if (res.success){
                  console.log(res.reporte)
                  res.reporte.estado = "Rechazado"
                  res.reporte.razones = inputValue+''
                  // res.reporte.activo = 1
                  this.reporteService.update_Reporte(res.reporte.id, res.reporte).subscribe((res:any)=>{
                    if (res.success){
                      this.propuestaService.update_Propuesta(this.Propuesta.id.toString(), this.Propuesta).subscribe((res2:any) =>{
                        if (res2.success){
                          let data = {
                            id_ciudadano:res.reporte.Ciudadano_id,
                            estado:'Rechazado',
                            idReporte:res.reporte.idReporte
                          }
                          this.authService.sendEmail(data).subscribe((res:any)=>{
                            if(res.success){
                              console.log(res)
                            }
                          }, error => {
                            console.log(error)
                          })
                          Swal.fire({
                            title: 'Perfecto',
                            text:"La propuesta ha sido rechazada",
                            icon:'success',
                            confirmButtonColor: '#052a5d'
                          }).then((result) =>{
                            window.location.reload(true)
                          })
                        }
                      }, error => {
                        this.errorSwal(error, true)
                      })
                    }
                  }, error => {
                    this.errorSwal(error, false)
                  })
                }
              }, error => {
                this.errorSwal(error, false)
              })
            }
          }else{
            resolve('Debe ingresar las razones')
          }
        })
      }
    })
  }

  acceptAndRefuse(verificador:string): boolean{
    if (verificador === 'Aceptado' || verificador === 'Rechazado') {
      return false
    } else {
      return true
    }
  }

  errorSwal(error:any, recarga:boolean):void{
    let code=error.status
    if(code!=403&&code!=401){
      Swal.fire({
        title:'Oops',
        text:'Ha ocurrido un error: '+error.error.message,
        icon:'error',
        confirmButtonColor: '#052a5d'
      }).then((result) =>{
          if(recarga){
              window.location.reload(true)
          }
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
  descargarArchivo(url:string){
    //this.archivoService.descargarArchivo(url);
    window.open(url)
  }
  extension(nombre:string): string{
    let ext = nombre.split('.',2)
    return ext[1]
  }
}
