import { NgModule } from '@angular/core'
/* import { CommonModule } from '@angular/common' */
import { RouterModule, Routes } from '@angular/router'
import { InicioComponent } from '../componentes/inicio/inicio.component'
import { FormulariosComponent } from '../componentes/formularios/formularios.component'
import {DashbordCiudadanoComponent} from "../ciudadano/dashbord-ciudadano/dashbord-ciudadano.component";
import {DashbordEncargadoComponent} from "../encargado/dashbord-encargado/dashbord-encargado.component";
import {DashbordFinanzasComponent} from "../finanzas/dashbord-finanzas/dashbord-finanzas.component";
import {CanActivateService} from "../guards/can-activate.service";
import {EditarPropuestaComponent} from '../encargado/editar-propuesta/editar-propuesta.component';

const routes: Routes =[
  {path:'home', component:InicioComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'signup',component: FormulariosComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'login',component: FormulariosComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'contacto',component: FormulariosComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'reset_pass',component: FormulariosComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'reset_verify',component: FormulariosComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
  {path:'dash_Ciudadano',component: DashbordCiudadanoComponent, canActivate:[CanActivateService], data: {rol : 'ciudadano'}},
  {path:'dashCiudadano/perfil',component: DashbordCiudadanoComponent, canActivate:[CanActivateService], data: {rol : 'ciudadano'}},
  {path:'dashCiudadano/ingresar_reporte',component: DashbordCiudadanoComponent, canActivate:[CanActivateService], data: {rol : 'ciudadano'}},
  {path:'dashCiudadano/modificar_reporte',component: DashbordCiudadanoComponent, canActivate:[CanActivateService], data: {rol : 'ciudadano'}},
  {path:'dashCiudadano/reportes_ingresados',component: DashbordCiudadanoComponent, canActivate:[CanActivateService], data: {rol : 'ciudadano'}},
  {path:'dashEncargado',component: DashbordEncargadoComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashEncargado/perfil',component: DashbordEncargadoComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashEncargado/reportes',component: DashbordEncargadoComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashEncargado/propuestas',component: DashbordEncargadoComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashEncargado/editarpropuesta',component: EditarPropuestaComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashEncargado/generar_propuesta',component: DashbordEncargadoComponent, canActivate:[CanActivateService], data: {rol : 'encargado'}},
  {path:'dashFinanzas',component: DashbordFinanzasComponent, canActivate:[CanActivateService], data: {rol : 'finanzas'}},
  {path:'dashFinanzas/perfil',component: DashbordFinanzasComponent, canActivate:[CanActivateService], data: {rol : 'finanzas'}},
  {path:'dashFinanzas/propuestas',component: DashbordFinanzasComponent, canActivate:[CanActivateService], data: {rol : 'finanzas'}},
  {path:'**', component:InicioComponent, canActivate: [CanActivateService], data: {rol:'persona'}},
];

@NgModule({
  imports: [
/*     CommonModule */
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],

})
export class AppRoutingModule { }
