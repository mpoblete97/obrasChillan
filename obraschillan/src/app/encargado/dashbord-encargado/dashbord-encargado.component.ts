import {Component, Input, NgZone, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {EncargadoService} from '../../services/encargado.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ReporteService} from '../../services/reporte.service';
import $ from 'jquery';
import {IReporte} from "../../interfaces/reporte.interface";
import {PropuestaService} from "../../services/propuesta.service";
import { CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-dashbord-encargado',
  templateUrl: './dashbord-encargado.component.html',
  styleUrls: ['./dashbord-encargado.component.css']
})
export class DashbordEncargadoComponent implements OnInit {
  User: any;
  check: boolean;
  tipo: string
  charging: boolean=true
  charging2: boolean=true
  titulo:string = "Reportes"
  config = {
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: 0
  }
  ready:boolean=false
  // public maxSize: number = 7;
  // public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: '<-',
    nextLabel: '->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(private encargadoService: EncargadoService, public router: Router,
              private authService: AuthService, private reportService: ReporteService,
              private propuestaService: PropuestaService, private cookieService:CookieService) {
  }

  ngOnInit(): void {
    this.onChangeScreen();

    let id = sessionStorage.getItem('id');
    this.tipo = sessionStorage.getItem('type')
    this.encargadoService.getById(id).subscribe((resp: any) => {
      this.User = resp.user[0];
      this.charging = false
      console.log(this.User);
    }, err => {
      console.log(err);
      this.errorSwal(err)
    });
    //Obtener reportes
    if(this.router.isActive('/dashEncargado/reportes',true)){
      this.reportService.getAll_encargado(id).subscribe((res: any[]) => {
        this.reportService.reportes = res
        this.config.totalItems=this.getReports().length
        this.ready = true
        this.charging2=false
      }, error => {
        this.errorSwal(error)
      });
    }else if(this.router.isActive('/dashEncargado/propuestas', true)){
      this.propuestaService.getByEncargado(id).subscribe(resp =>{
        this.propuestaService.propuestas = resp
        this.config.totalItems = this.getPropuestas().length
        console.log(this.getPropuestas().length)
        this.ready = true
        this.charging2 = false
      }, error => {
        this.errorSwal(error)
      })
    }

  }

  reload(nombre:string){
    if (nombre == 'Perfil' && this.router.isActive('/dashEncargado/perfil', true)){
      window.location.reload(true)
    }
    if (nombre == 'Reporte' && this.router.isActive('/dashEncargado/reportes', true)){
      window.location.reload(true)
    }
    if (nombre == 'Propuesta' && this.router.isActive('/dashEncargado/propuestas', true)){
      window.location.reload(true)
    }
  }

  logout() {
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Se cerrará su sesión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.value) {
        this.authService.logOut();
        Swal.fire({
          title: '',
          text: 'Sesión Cerrada con éxito',
          icon: 'success',
          confirmButtonColor: '#052a5d'
        }).then((result) => {
          if (result) {
            this.router.navigate(['home']);
          }
        });
      }
    });
  }

  getReports() {
    return this.reportService.reportes;
  }

  getPropuestas(){
    return this.propuestaService.propuestas;
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

  onPageChange(event){
    this.config.currentPage = event;
  }

  getRecepcionados(nombre: string){
    this.ready=false
    this.reportService.getAll_Recepcionados().subscribe(resp => {
      this.reportService.reportes=resp
      this.titulo="Reportes "+nombre
      this.config.totalItems=this.getReports().length
      this.ready = true
      this.charging2=false;
    }, error => {
      this.errorSwal(error)
    });
  }

  getNoRecepcionados(){
    this.ready=false
    this.reportService.getAll_noRecepcionados().subscribe(resp => {
      this.reportService.reportes=resp
      this.titulo="Reportes Ingresados"
      this.config.totalItems = this.getReports().length
      this.ready = true
      this.charging2=false;
    }, error => {
      this.errorSwal(error)
    });
  }

  getConPropuesta(){
    this.ready=false
    this.reportService.getAll_enProceso().subscribe(resp => {
      this.reportService.reportes=resp
      this.titulo="Reportes con Propuesta Generada"
      this.config.totalItems=this.getReports().length
      this.ready = true
      this.charging2=false;
      //console.log(this.charging2 + this.reportes.toString())
    }, error => {
      this.errorSwal(error)
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
  goPerfil(){
    this.router.navigate(['dashEncargado/perfil'])
  }
}


