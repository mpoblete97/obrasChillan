import { Component, OnInit } from '@angular/core';
import {FinanzasService} from "../../services/finanzas.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {AuthService} from "../../services/auth.service";
import $ from "jquery"
import {PropuestaService} from '../../services/propuesta.service';
@Component({
  selector: 'app-dashbord-finanzas',
  templateUrl: './dashbord-finanzas.component.html',
  styleUrls: ['./dashbord-finanzas.component.css']
})
export class DashbordFinanzasComponent implements OnInit {
  User:any
  check: boolean;
  tipo: string
  charging: boolean=true
  charging2: boolean=true
  config = {
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: 0
  }
  ready:boolean=false
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
    previousLabel: '<-',
    nextLabel: '->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(private finanzasService: FinanzasService, public router:Router,
              private authService: AuthService, private propuestaService:PropuestaService) { }

  ngOnInit(): void {
    this.onChangeScreen();
    let id = sessionStorage.getItem('id')
    this.tipo = sessionStorage.getItem('type')
    this.finanzasService.getById(id).subscribe((resp: any) => {
      this.User = resp.user[0];
      this.charging = false
    }, err => {
      this.errorSwal(err)
    })
    //Obtener Propuestas
    this.propuestaService.getAll().subscribe((res:any[])=>{
      this.propuestaService.propuestas = res
      this.config.totalItems=this.getPropuestas().length
      console.log(this.getPropuestas().length)
      this.charging2 = false
      this.ready = true
    }, error => {
      this.errorSwal(error)
    })
  }

  reload(nombre:string){
    if (nombre == 'Perfil' && this.router.isActive('/dashFinanzas/perfil', true)){
      window.location.reload(true)
    }
    if (nombre == 'Propuesta' && this.router.isActive('/dashFinanzas/propuestas', true)){
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
    console.log(innerWidth)
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

  getPropuestas(){
    return this.propuestaService.propuestas
  }

  onPageChange(event){
    this.config.currentPage = event;
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
    this.router.navigate(['dashFinanzas/perfil'])
  }
}
