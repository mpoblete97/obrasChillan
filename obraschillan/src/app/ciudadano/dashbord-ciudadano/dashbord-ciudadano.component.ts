import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {CiudadanoService} from "../../services/ciudadano.service";
import {AuthService} from "../../services/auth.service";
import Swal from "sweetalert2";
import $ from 'jquery';
import {ReporteService} from '../../services/reporte.service';
import {IReporte} from '../../interfaces/reporte.interface';
import {VerTarjetaService} from '../../services/ver-tarjeta.service';
@Component({
  selector: 'app-dashbord-ciudadano',
  templateUrl: './dashbord-ciudadano.component.html',
  styleUrls: ['./dashbord-ciudadano.component.css']
})
export class DashbordCiudadanoComponent implements OnInit {
  User: any
  check: boolean;
  id:string
  ready:boolean = false
  tipo: string
  charging: boolean=true
  video:boolean = true
  ver:boolean = false
  @Output() mostrar = new EventEmitter()
  config = {
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: 0
  }
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: '<-',
    nextLabel: '->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(private ciudadanoService: CiudadanoService, public router: Router, private authService: AuthService, public modal:VerTarjetaService, private reportService:ReporteService) {
  }

  ngOnInit(): void {
    this.onChangeScreen();
    this.id = sessionStorage.getItem('id')
    this.tipo = sessionStorage.getItem('type')
    this.ciudadanoService.getById(this.id).subscribe((resp: any) => {
      this.User = resp.user[0];
      this.charging = false
      console.log(this.User);
    }, err => {
      console.log(err)
      this.errorSwal(err)
    })
    this.reportService.getAll_byCiudadano(this.id).subscribe(resp => {
      this.reportService.reportes = resp
      this.config.totalItems=this.getReports().length
      this.ready = true
    }, error => console.log(error))
  }

  ocultarModal(){
    this.mostrar.emit(false)
    this.video = false
    this.ver = false
    this.modal.ocultarModal()
  }

  abrirModal(){
    this.video=true
    this.ver = true
    this.modal.mostrarModal()
  }

  reload(nombre:string){
    if (nombre == 'Perfil' && this.router.isActive('/dashCiudadano/perfil', true)){
      window.location.reload(true)
    }
    if (nombre == 'IReporte' && this.router.isActive('/dashCiudadano/ingresar_reporte', true)){
      window.location.reload(true)
    }
  }

  logout(){
    Swal.fire({
      title: '¿Está Seguro?',
      text:"Se cerrará su sesión",
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText:'Confirmar',
    }).then((result) => {
      if(result.value){
        this.authService.logOut();
        Swal.fire({
          title: '',
          text: 'Sesión Cerrada con éxito',
          icon: "success",
          confirmButtonColor: '#052a5d'
        }).then((result) => {
          if(result){
            this.router.navigate(['home'])
          }
        })
      }
    })
  }
  onChangeScreen(): void {
    let burger = document.querySelector('.burger')
    burger.classList.toggle('toggle')
    if (window.innerWidth <= 1024) {
      // $('#check').prop('checked', true)
      this.check=true
      burger.classList.toggle('toggle')
    }
    window.onresize = (e) => {
      if (window.innerWidth <= 1024 && $('#check').prop('checked') == false) {
        $('#check').prop('checked', true)
        burger.classList.toggle('toggle')
      }
      if (window.innerWidth > 1024 && $('#check').prop('checked') == true) {
        $('#check').prop('checked', false)
        burger.classList.toggle('toggle')
      }
    }
  }

  onCheckChange(): void {
    let burger = document.querySelector('.burger')
    burger.classList.toggle('toggle')

  }
  getReports(){
    //Arreglo de reportes
    return this.reportService.reportes
  }

  verReportes(){
    //Obtener reportes
    this.reportService.getAll_byCiudadano(this.id).subscribe((res:any) => {
      this.reportService.reportes = res
      console.log(res)
      this.config.totalItems=this.getReports().length
      if(this.getReports().length===0){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:'Nada por aquí, aún no ingresas reportes',
          confirmButtonColor: '#052a5d'
        })
        this.router.navigate(['/dashCiudadano/ingresar_reporte'])
        return
      }
      if (this.router.isActive('/dashCiudadano/reportes_ingresados', true)){
        window.location.reload(true)
      }
      this.ready = true
    }, error => {
      console.log(error)
      this.errorSwal(error)
    })
  }
  onPageChange(event){
    this.config.currentPage = event;
  }

  atrapadorReportes(reporte){
    this.reportService.reporte = reporte

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
  goPerfil(){
    this.router.navigate(['/dashCiudadano/perfil'])
  }
}
