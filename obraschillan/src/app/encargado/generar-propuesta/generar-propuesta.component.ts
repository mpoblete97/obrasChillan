import {Component, HostListener, OnInit} from '@angular/core';
import {ReporteService} from '../../services/reporte.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {CostoService} from '../../services/costo.service';
import {ArchivoService} from '../../services/archivo.service';
import {PropuestaService} from '../../services/propuesta.service';
import {IPropuesta} from '../../interfaces/propuesta.interface';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-generar-propuesta',
  templateUrl: './generar-propuesta.component.html',
  styleUrls: ['./generar-propuesta.component.css']
})
export class GenerarPropuestaComponent implements OnInit {
  formPropuesta: FormGroup;
  id_reporte = '';
  fecha_reporte = '';
  estado = '';
  descripcion_reporte = '';
  id_propuesta = '';
  fecha_propuesta = '';
  descripcion_propuesta = '';
  tipo = 'Selecciona...';
  costos = [['costo0', '', '', '']];
  documentos = [];
  // costos
  posEdit = -1;
  id = 'costo0';
  i = 0;
  last = 0;
  cantidad = 1;
  montoTotal = 0;
  //Archivos
  files;
  obligatorio: boolean = false
  archivosPropuesta: Array<File>;
  subir = 'Subir...'
  //Fecha Actual
  fechaHoy = new Date();

  constructor(private reportService: ReporteService, private router: Router, private formBuilder: FormBuilder,private authService:AuthService,
              private costoService: CostoService, private archivoService: ArchivoService, private propuestaService: PropuestaService) {
    this.formPropuesta = this.formBuilder.group({
      id_reporte: ['', [Validators.required]],
      fecha_reporte: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      descripcion_propuesta: ['', [Validators.required]],
      costos: ['', [Validators.required]],
      id_propuesta: ['', [Validators.required]],
      fecha_propuesta: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      files: ['', [Validators.required]]

    });
  }


  ngOnInit(): void {
  }

  getReporte() {
    if (this.reportService.reportePropuesta == undefined) {
      this.router.navigate(['dashEncargado/reportes']);
    } else {
      return this.reportService.reportePropuesta;
    }
  }

  transformDate(fecha: string): string {
    let fechita = new Date(fecha);
    let y: any = fechita.getFullYear();
    let m: any = fechita.getMonth() + 1;
    let d: any = fechita.getDate();
    if (d < 10) {
      d = '0' + d;
    }
    if (m < 10) {
      m = '0' + m;
    }
    return `${d}-${m}-${y}`;
  }

  addCosto(): void {
    // var original = document.getElementById('costo'+this.i);
    // var duplicate = original.cloneNode(true)
    // // duplicate.='costo'+ this.i++
    // this.i++
    // original.appendChild(duplicate)
    var nuevo = $('#costo' + this.i).clone();
    // let nuevo_id:string=`costo${this.i++}`
    this.i++;
    $(nuevo).attr('id', 'costo' + this.i);
    console.log($(nuevo).attr('id') + this.i);
    $(nuevo).insertAfter('#costo' + (this.i - 1));
    this.cantidad++;
    //Al guardar uno, y duplicarlo, el segundo se crea con readonly, por ello es necesario
    //quitarlo para evitar dramas
    let inputs = document.querySelectorAll('#' + $(nuevo).attr('id') + ' input');
    $(inputs[0]).attr('readonly', false);
    $(inputs[0]).val('');
    $(inputs[1]).attr('readonly', false);
    $(inputs[1]).val('');
    //Setear on keypress a duplicados, FALTA
    $(inputs[2]).attr('readonly', false);
    $(inputs[2]).val('');
    $(inputs[3]).val('');
    let buttons = document.querySelectorAll('#' + $(nuevo).attr('id') + ' #botones' + ' button');
    // $(buttons[0]).attr('onclick',function() {
    //   this.saveCosto(this)
    // })
    // $(buttons[0]).addEventListeners('click',this.saveCosto($(buttons[0]).click()),false)
    // $(buttons[0]).on("click","button","saveCosto(this)")
    // $(buttons[1]).on("click",this.deleteCosto(document.getElementById(""+$(nuevo).attr('id'))))
    // $(buttons[2]).on("click",this.editCosto(document.getElementById(""+$(nuevo).attr('id'))))
    buttons[0].addEventListener('click', onclick => {
      this.saveCosto(document.getElementById('' + $(nuevo).attr('id')));
    });

    $(buttons[0]).attr('disabled', false)//save->habilitado
    buttons[1].addEventListener('click', onclick => {
      this.deleteCosto(document.getElementById('' + $(nuevo).attr('id')));
    });
    buttons[2].addEventListener('click', onclick => {
      this.editCosto(document.getElementById('' + $(nuevo).attr('id')));
    });
    $(buttons[2]).attr('disabled', true)//edit->deshabilitado
    //Por ultimo añado el elemento vacío
    this.costos.push([$(nuevo).attr('id'), '', '']);
    // alert(buttons[0].className)
    //0->save;1->delete;2->edit


  }

  saveCosto(event): void {
    console.log(event.id + ' save');
    let posicion = event.id.substring(event.id.length - 1, event.id.length);
    let inputs = document.querySelectorAll('#' + event.id + ' input');
    if ($(inputs[1]).val().search('[a-zA-Z]')!=-1 || $(inputs[2]).val().search('[a-zA-Z]')!=-1){
      Swal.fire({
        title: 'Oops...',
        text: 'No se permiten letras en monto y cantidad',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      });
      $(inputs[1]).val('')
      $(inputs[2]).val('')
      return;
    }
    if ($(inputs[0]).val() == '' || $(inputs[1]).val() == '' || $(inputs[2]).val() == '') {
      Swal.fire({
        title: 'Oops...',
        text: 'Debes ingresar todos los datos',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      });
      return;
    }
    $(inputs[0]).attr('readonly', true);
    $(inputs[1]).attr('readonly', true);
    $(inputs[2]).attr('readonly', true);
    let monto = ($(inputs[1]).val() * 1) * ($(inputs[2]).val() * 1);
    $(inputs[3]).val(monto);
    this.montoTotal += monto;
    $(inputs[3]).val(`\$${$(inputs[3]).val()}`);
    this.costos[posicion] = [event.id, $(inputs[0]).val(), $(inputs[1]).val(), $(inputs[2]).val()];
    $(inputs[1]).val(`\$${$(inputs[1]).val()}`);
    // if(this.posEdit!=-1) {
    //   this.costos[this.posEdit] = [event.id, $(inputs[0]).val(), $(inputs[1]).val()]
    // }//else {
    //   this.costos.push([event.id, $(inputs[0]).val(), $(inputs[1]).val()])
    // }
    //this.posEdit=-1
    for (let j = 0; j < this.costos.length; j++) {
      console.log(this.costos[j]);
    }

    //Validar click
    var btn = document.querySelectorAll('#'+event.id+' button')

    //0->save;1->delete;2->edit
    $(btn[0]).attr('disabled', true)//save disabled
    $(btn[2]).attr('disabled', false)//edit activated

  }

  deleteCosto(event): void {
    let input = document.querySelectorAll('#' + event.id + ' input');
    if ($(input[0]).val() != '' || $(input[1]).val() != '' || $(input[2]).val() != '') {
      Swal.fire({
        title: '¿Está Seguro?',
        text: 'Se borrara el costo seleccionado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#052a5d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        this.del(event);
      });
    } else {
      this.del(event);
    }
  }

  del(event): void {
    console.log(event.id + ' delete');
    if (this.cantidad == 1) {
      Swal.fire({
        title: 'Oops...',
        text: 'Debes ingresar al menos un costo',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      });
      return;
    }
    let inputs = document.querySelectorAll('#' + event.id + ' input');
    let posicion = event.id.substring(event.id.length - 1, event.id.length);
    if (posicion == (this.cantidad - 1) && posicion != 0/*&&($(inputs[0]).val()=='' && $(inputs[1]).val()=='')*/) {
      $('#' + event.id).remove();
      this.cantidad--;
      this.i--;
      this.costos.pop();
    } else if (posicion == 0) {
      $('#' + event.id).remove();
      this.cantidad--;
      this.i--;
      this.costos.shift();
      //proceso de pasar indice 1 ->0 ; 2->1, etc.
      for (let j = 0; j < this.costos.length; j++) {
        this.costos[j][0] = 'costo' + j;
        //Falta cambiar los id de los elementos
        let aux = j + 1;
        $('#costo' + aux).attr('id', 'costo' + j);
      }
    } else {
      //de en medio
      for (let j: number = posicion; j < this.costos.length; j++) {
        this.costos[j] = this.costos[j * 1 + 1 * 1];
        let aux: number = (j * 1 + 1 * 1);
        let inputs = document.querySelectorAll('#costo' + j + ' input');
        let inputs_2 = document.querySelectorAll('#costo' + aux + ' input');
        $(inputs[0]).val($(inputs_2[0]).val());
        $(inputs[1]).val($(inputs_2[1]).val());
        $(inputs[2]).val($(inputs_2[2]).val());
      }
      $('#costo' + this.i).remove();
      this.costos = this.costos.filter(function(element) {
        return element !== undefined;
      });
      this.cantidad--;
      this.i--;
      for (let j = 0; j < this.costos.length; j++) {
        this.costos[j][0] = 'costo' + j;
      }
    }
  }

  editCosto(event): void {
    console.log(event.id + ' edit');
    let inputs = document.querySelectorAll('#' + event.id + ' input');
    $(inputs[0]).attr('readonly', false);
    $(inputs[1]).attr('readonly', false);
    $(inputs[1]).val(parseInt($(inputs[1]).val().substring(1,$(inputs[1]).val().length)))
    $(inputs[2]).attr('readonly', false);
    this.montoTotal-=parseInt($(inputs[3]).val().substring(1,$(inputs[3]).val().length))
    let posicion = event.id.substring(event.id.length - 1, event.id.length);
    console.log(posicion);
    this.posEdit = posicion;
    //Validar click
    var btn = document.querySelectorAll('#'+event.id+' button')

    //0->save;1->delete;2->edit
    $(btn[0]).attr('disabled', false)//save disabled
    $(btn[2]).attr('disabled', true)//edit activated
  }

  onFileChange(e) {
    console.log(e);
    this.archivosPropuesta = e.target.files;
    if(this.archivosPropuesta.length == 0){
      this.subir = 'Subir...'
    }else if(this.archivosPropuesta.length == 1){
      this.subir = this.archivosPropuesta[0].name
    }else{
      this.subir = this.archivosPropuesta.length+' archivos'
    }
  }

  generarPropuesta(): void {
    let form = document.querySelector('form')
    let generar = document.querySelector('#generar')
    let progressbar = document.querySelector('.progress-line')
    $(form).css({'filter':'blur(10px)'})
    $(generar).attr('disabled', true)
    $(progressbar).css({'display':'-webkit-flex'})

    let datos = document.querySelectorAll('input, textarea, select');
    let vacio = 0;
    for (let j = 0; j < datos.length; j++) {
      if (($(datos[j]).attr('id') == 'tipo' && $(datos[j]).val() == 'Selecciona...') ||
        ($(datos[j]).attr('id') == 'desc_prop' && $(datos[j]).val() == '')) {
        console.log($(datos[j]).attr('id'));
        vacio++;
      }
    }
    if (vacio > 0) {
      this.obligatorio = true
      Swal.fire({
        title: 'Oops...',
        text: 'Debes rellenar todos los campos',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      });
      $(form).css({'filter':'blur(0px)'})
      $(generar).attr('disabled', false)
      $(progressbar).css({'display':'none'})
      return;
    }
    vacio = 0;
    let noGuardado = 0;
    for (let j = 0; j < this.costos.length; j++) {
      if (this.costos[j][1] == '' || this.costos[j][2] == '' || this.costos[j][3] == '') {
        noGuardado++;
      }
    }
    if (noGuardado > 0) {
      Swal.fire({
        title: 'Oops...',
        text: 'Debes guardar todos los costos que añadiste',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      });
      $(form).css({'filter':'blur(0px)'})
      $(generar).attr('disabled', false)
      $(progressbar).css({'display':'none'})
      return;
    }
    noGuardado = 0;
    let propuesta: IPropuesta = {
      id: null,
      idPropuesta: `P${this.getReporte().idReporte}`,
      tipo: this.formPropuesta.get('tipo').value,
      descripcion: this.formPropuesta.get('descripcion_propuesta').value,
      razones: null,
      Encargado_id: this.getReporte().Encargado_id,
      Reporte_id: this.getReporte().id,
      Finanzas_id: null,
      activo: true,
      fecha: null
    };
    if (this.archivosPropuesta==undefined){
      this.archivosPropuesta = []
    }
    if (this.archivosPropuesta.length>0){
      console.log(this.archivosPropuesta.length)
      this.propuestaService.insertPropuesta(propuesta).subscribe((resp: any) => {
        if (resp.success) {
          console.log(resp);
          let idPropuesta = resp.id;
          let errorCosto = 0
          //Guardar Costos
          for (let j = 0; j < this.costos.length; j++) {
            let costo = {
              detalle: this.costos[j][1],
              costo_unitario: this.costos[j][2],
              cantidad: this.costos[j][3],
              id_propuesta: idPropuesta
            };
            this.costoService.insert(costo).subscribe((resp: any) => {
              if (resp.success) {
                console.log(resp.costo);
              } else {
                errorCosto++
              }
            });
          }
          if (errorCosto>0){
            $(form).css({'filter':'blur(0px)'})
            $(generar).attr('disabled', false)
            $(progressbar).css({'display':'none'})
            Swal.fire({
              title: 'Error',
              text: 'Se ha producido un error al guardar los costos',
              icon: 'error',
              confirmButtonColor: '#052a5d'
            });
            return this.router.navigate(['/dashEncargado/reportes'])
          }

          let formData = new FormData();
          for (let j = 0; j < this.archivosPropuesta.length; j++) {
            formData.append('archivo', this.archivosPropuesta[j], this.archivosPropuesta[j].name);
          }
          this.archivoService.upload(idPropuesta, formData).subscribe((res: any) => {
            if (res.success) {
              console.log(res);
            }
          }, error => {
            $(form).css({'filter':'blur(0px)'})
            $(generar).attr('disabled', false)
            $(progressbar).css({'display':'none'})
            this.errorSwal(error)
            console.log(error);
            return this.router.navigate(['/dashEncargado/reportes']);
          });
          this.getReporte().estado = 'En proceso';
          this.reportService.update_Reporte(this.getReporte().id+'', this.getReporte()).subscribe((res: any) => {
            if (res.success) {
              let data = {
                id_ciudadano:this.getReporte().Ciudadano_id,
                estado:'En proceso',
                idReporte:this.getReporte().idReporte
              }
              this.authService.sendEmail(data).subscribe((res:any)=>{
                if(res.success){
                  console.log(res)
                }
              }, error => {
                console.log(error)
              })
              console.log(res);
            }
          }, error => {
            $(form).css({'filter':'blur(0px)'})
            $(generar).attr('disabled', false)
            $(progressbar).css({'display':'none'})
            this.errorSwal(error)
            console.log(error);
            return this.router.navigate(['/dashEncargado/reportes']);
          });
          Swal.fire({
            title: '',
            text:'¡Propuesta generada con éxito!',
            icon:'success',
            confirmButtonColor: '#052a5d'
          }).then((result)=>{
            $(form).css({'filter':'blur(0px)'})
            $(generar).attr('disabled', false)
            $(progressbar).css({'display':'none'})
            this.router.navigate(['/dashEncargado/propuestas'])
          })
        }
      }, error => {
        $(form).css({'filter':'blur(0px)'})
        $(generar).attr('disabled', false)
        $(progressbar).css({'display':'none'})
        this.errorSwal(error)
        console.log(error)
        return this.router.navigate(['/dashEncargado/reportes'])
      })
    }else{
      this.obligatorio = true
      Swal.fire({
        title: 'Oops...',
        text: 'Debes rellenar todos los campos',
        icon: 'error',
        confirmButtonColor: '#052a5d'
      }).then((result) =>{
        $(form).css({'filter':'blur(0px)'})
        $(generar).attr('disabled', false)
        $(progressbar).css({'display':'none'})
      })
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
}
