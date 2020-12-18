//MODULOS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing/app-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import {SocialLoginModule, SocialAuthService, SocialAuthServiceConfig} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
//COMPONENTES
import { AppComponent } from './app.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { TarjetaComponent } from './componentes/tarjeta/tarjeta.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { FormulariosComponent } from './componentes/formularios/formularios.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { DashbordFinanzasComponent } from './finanzas/dashbord-finanzas/dashbord-finanzas.component';
import { DashbordCiudadanoComponent } from './ciudadano/dashbord-ciudadano/dashbord-ciudadano.component';
import { MapaComponent } from './ciudadano/mapa/mapa.component';
import { IngresarReporteComponent } from './ciudadano/ingresar-reporte/ingresar-reporte.component';
import { DashbordEncargadoComponent } from './encargado/dashbord-encargado/dashbord-encargado.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { EditarPerfilComponent} from './componentes/editar-perfil/editar-perfil.component';
import { VerTarjetaComponent } from './componentes/ver-tarjeta/ver-tarjeta.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { GenerarPropuestaComponent } from './encargado/generar-propuesta/generar-propuesta.component';
import { ModificarReporteComponent } from './ciudadano/modificar-reporte/modificar-reporte.component';
import { ResetPasswordComponent } from './componentes/reset-password/reset-password.component';
import { ResetVerifyComponent } from './componentes/reset-verify/reset-verify.component';
import { ImagePipe } from './componentes/shared/image.pipe';
import { EditarPropuestaComponent } from './encargado/editar-propuesta/editar-propuesta.component';

let configAuth = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers:[
      {
        id:GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('844797839333-2d5semr3ivr2k4ksriq0eqsbkb8pp0tf.apps.googleusercontent.com')
      },
    ],
  } as SocialAuthServiceConfig,
}

registerLocaleData(localeEsCL, 'es-CL');

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TarjetaComponent,
    SidebarComponent,
    InicioComponent,
    InicioSesionComponent,
    RegistroComponent,
    FormulariosComponent,
    NavbarComponent,
    ContactoComponent,
    DashbordFinanzasComponent,
    MapaComponent,
    IngresarReporteComponent,
    DashbordCiudadanoComponent,
    DashbordEncargadoComponent,
    PerfilComponent,
    VerTarjetaComponent,
    EditarPerfilComponent,
    GenerarPropuestaComponent,
    ModificarReporteComponent,
    ResetPasswordComponent,
    ResetVerifyComponent,
    ImagePipe,
    EditarPropuestaComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAW3kAMj8Z7Ksd9RSMGwsA49kIOW34LwFw',
            libraries: ['places']
        }),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        SocialLoginModule,
        GooglePlaceModule
    ],
  providers: [configAuth, {provide:LOCALE_ID,useValue:'es-CL'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
