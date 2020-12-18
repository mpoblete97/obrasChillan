import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IReporte} from '../../interfaces/reporte.interface';
import {ReporteService} from '../../services/reporte.service';
import {ImagenesInterface} from '../../interfaces/imagenes.interface';
import {IPropuesta} from '../../interfaces/propuesta.interface';
import {Router} from '@angular/router';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';
import * as moment from 'moment'
import $ from 'jquery'
import Swal from "sweetalert2";
import {PropuestaService} from "../../services/propuesta.service";
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit{
  @Output() reporte1:EventEmitter<IReporte>
  @Input() reporte:IReporte
  @Input() propuesta:IPropuesta
  bi_estado:string='Aceptado / Rechazado'
  image:ImagenesInterface
  nombre:string
  estado:string
  charging:boolean=true
  mostrar:boolean=false

  constructor(private reportService:ReporteService, public router:Router, private modal: VerTarjetaService,
              private propuestaService: PropuestaService, private authService:AuthService) {

                    this.reporte1 = new EventEmitter<IReporte>()
  }

  ngOnInit(): void {
    this.image = new class implements ImagenesInterface {
      activo: boolean;
      id: number;
      reporte_id: number;
      url: string;
    }
    this.mostrar=false
    if(this.router.isActive('/dashEncargado/reportes',true)||
      this.router.isActive('/dashCiudadano/reportes_ingresados',true))
    {
      this.reportService.get_images(this.reporte.id.toString()).subscribe((res: any[]) => {
        if(this.reporte.estado=='Aceptado' || this.reporte.estado =='Rechazado'){
          this.bi_estado=this.reporte.estado
        }
        // console.log(res)
        this.image = res[0]
        // this.chargueEstado("reportes", this.reporte.estado)
        this.charging = false
      }, error => {

        this.image.url = 'https://static.thenounproject.com/png/3104878-200.png'
        this.charging = false
      })
    }
    if(this.router.isActive('/dashFinanzas/propuestas', true)){
      console.log(this.propuesta)
      this.reportService.get_ReporteId(this.propuesta.Reporte_id.toString()).subscribe(res =>{
        this.estado = res.reporte.estado
        this.reporte= res.reporte
        if(this.reporte.estado=='Aceptado' || this.reporte.estado =='Rechazado'){
          this.bi_estado=this.reporte.estado
        }
        console.log(res.reporte)
        // this.chargueEstado("propuestas", res.reporte.estado)
      }, error => {
        this.errorSwal(error)
      })
      this.reportService.get_images(this.propuesta.Reporte_id.toString()).subscribe(res => {
        this.image = res[0]
        this.charging = false
      }, error => {
        this.image.url = 'https://static.thenounproject.com/png/3104878-200.png'
        this.charging = false
      })
    }
    if(this.router.isActive('/dashEncargado/propuestas', true)){
      this.reportService.get_ReporteId(this.propuesta.Reporte_id.toString()).subscribe(res =>{
        this.estado = res.reporte.estado
        this.reporte = res.reporte
        if(this.reporte.estado=='Aceptado' || this.reporte.estado =='Rechazado'){
          this.bi_estado=this.reporte.estado
        }
        this.reportService.get_images(this.propuesta.Reporte_id.toString()).subscribe(res2 => {
          this.image = res2[0]
          // this.chargueEstado("propuestas", this.estado)
          this.charging = false
        }, error => {
          this.image.url = 'https://static.thenounproject.com/png/3104878-200.png'
          this.charging = false
        })
      }, error => {
        this.errorSwal(error)
      })

    }
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

  abrirModal(id:string){
    this.nombre = id
    console.log(id)
    this.mostrar = true
    this.modal.mostrarModal()
  }

  activar(){
    if(this.nombre == "Reporte" || this.nombre == 'Propuesta2'){
      return this.reporte
    }else{
      return this.propuesta
    }

  }

  recibe(mostrar){
    this.mostrar=mostrar
  }
  goToGenerate():void{
      this.router.navigate(['/dashEncargado/generar_propuesta'])
      this.reportService.reportePropuesta = this.reporte
  }

  editarPropuesta(propuesta, nombre):void{
   // window.location.reload(true)
    this.router.navigate(['dashEncargado/editarpropuesta']);
    this.propuestaService.Propuesta = propuesta;
    this.reportService.reportePropuesta = this.reporte;

  }
  // goToModify(){
  //   this.router.navigate(['dashEncargado/modificar_propuesta'])
  //   this.reportService.reportePropuesta = this.reporte
  //   this.propuestaService.Propuesta = this.propuesta
  // }

  enviarReporte(evento){
    this.reporte1.emit(this.reporte)
  }

  showModify():boolean{
    let now = new Date()
    let fecha1 = moment(this.reporte.fecha.toString())
    let fecha2 = moment(now.toString())
    if(fecha2.diff(fecha1, 'minutes')>=1440){
      return false
    }else if(this.reporte.estado == 'Ingresado') {
      return true
    }
  }

  showModifyPropuesta():boolean{
    let now = new Date()
    let fecha1 = moment(this.propuesta.fecha.toString())
    let fecha2 = moment(now.toString())
    if(fecha2.diff(fecha1, 'minutes')>=1440){
      return false
    }else{
      return true
    }
  }

  eliminarReporte(){
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Se eliminara el reporte seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.value) {
        this.reportService.deleteReporte(this.reporte.id.toString(), this.reporte).subscribe((resp: any) => {
          if(resp.success){

            Swal.fire({
              title: '',
              text: 'El reporte se ha eliminado con exito',
              icon: 'success',
              confirmButtonColor: '#052a5d'
            }).then((result) => {
              if (result) {
                window.location.reload()
              }
            });
          }
        }, error => {
          this.errorSwal(error)
        })
      }
    });
  }

  eliminarPropuesta(){
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Se eliminara la propuesta seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.value) {
        console.log('holi')
        this.propuestaService.deletePropuesta(this.propuesta.id.toString(), this.propuesta).subscribe((resp: any) => {
          if(resp.success){
            this.reporte.estado='Recepcionado'
            this.reportService.update_Reporte(this.reporte.id.toString(),this.reporte).subscribe((res: any) =>{
              if(res.success){
                let data = {
                  id_ciudadano:this.reporte.Ciudadano_id,
                  estado:'Recepcionado',
                  idReporte:this.reporte.idReporte
                }
                this.authService.sendEmail(data).subscribe((res:any)=>{
                  if(res.success){
                    console.log(res)
                  }
                }, error => {
                  console.log(error)
                })
                Swal.fire({
                  title: '',
                  text: 'La propuesta se ha eliminado con exito',
                  icon: 'success',
                  confirmButtonColor: '#052a5d'
                }).then((result) => {
                  if (result) {
                    window.location.reload()
                  }
                });
              }
            },error => {
              this.errorSwal(error)
            })
          }
        }, error => {
          this.errorSwal(error)
        })
      }
    });
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
