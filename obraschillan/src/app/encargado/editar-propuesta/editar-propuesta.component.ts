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
import {ICosto} from '../../interfaces/costo.interface';


@Component({
  selector: 'app-editar-propuesta',
  templateUrl: './editar-propuesta.component.html',
  styleUrls: ['./editar-propuesta.component.css']
})
export class EditarPropuestaComponent implements OnInit {
  archivos: any
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
  file
  cantidadDeArchivos: number;
  contadorDeArchivosBorrados: number = 0;
  archivosBaseDeDatos = [];
  costosBaseDeDatos = [];

  arregloArchivosDinamicos: Array<File> = [];


  propuesta:IPropuesta;

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
    //this.formPropuesta.setValue()
    this.propuesta = this.propuestaService.Propuesta;
    this.llenarPropuestaParaEditar();
    console.log(this.propuesta);

    this.archivoService.getByProp(this.propuesta.id.toString()).subscribe(resp =>{
      console.log(resp);
      this.archivos = resp
      for (let j = 0; j < this.archivos.length; j++) {
          this.archivosBaseDeDatos.push(this.archivos[j]);
      }
      this.cantidadDeArchivos = this.archivos.length;
    })

  }

  llenarPropuestaParaEditar(){
    this.formPropuesta.get('descripcion_propuesta').setValue(this.propuesta.descripcion);
    this.formPropuesta.get('tipo').setValue(this.propuesta.tipo);


    this.costoService.getByProp(this.propuesta.id.toString()).subscribe(resp => {
        console.log(resp)
      this.costosBaseDeDatos = resp;
      for (let i=0; i<resp.length;i++){
        this.llenarCostos(resp[i],i);
      }
    })
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

  llenarCostos(costo : ICosto, nroCosto:number): void {
    // var original = document.getElementById('costo'+this.i);
    // var duplicate = original.cloneNode(true)
    // // duplicate.='costo'+ this.i++
    // this.i++
    // original.appendChild(duplicate)
    let inputs;
    let buttons;
    console.log("numero", nroCosto)
    if(nroCosto===0){
      inputs = document.querySelectorAll('#' + 'costo0' + ' input');
      buttons = document.querySelectorAll('#' + 'costo0' + ' #botones' + ' button');
    //  this.costos.push(['costo0', '', '']);
      console.log("entree 0");
     // this.cantidad++;
    }else{
      console.log("entree 1++");
      var nuevo = $('#costo' + this.i).clone();
      // let nuevo_id:string=`costo${this.i++}`
      this.i++;
      $(nuevo).attr('id', 'costo' + this.i);
      console.log("algoooo: "+$(nuevo).attr('id') + this.i);
      $(nuevo).insertAfter('#costo' + (this.i - 1));
      this.cantidad++;
      //Al guardar uno, y duplicarlo, el segundo se crea con readonly, por ello es necesario
      //quitarlo para evitar dramas
      inputs = document.querySelectorAll('#' + $(nuevo).attr('id') + ' input');
      buttons = document.querySelectorAll('#' + $(nuevo).attr('id') + ' #botones' + ' button');
      this.costos.push([$(nuevo).attr('id'), '', '']);
    }



    $(inputs[0]).attr('readonly', false);
    $(inputs[0]).val(costo.detalle);
    $(inputs[1]).attr('readonly', false);
    $(inputs[1]).val(costo.costo_unitario);
    //Setear on keypress a duplicados, FALTA
    $(inputs[2]).attr('readonly', false);
    $(inputs[2]).val(costo.cantidad);
    $(inputs[3]).val('');
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
    // this.costos.push([$(nuevo).attr('id'), '', '']);
    // alert(buttons[0].className)
    //0->save;1->delete;2->edit
  }


  saveCosto(event): void {
    console.log(event)
    console.log(event.id + ' save');
    let posicion = event.id.substring(event.id.length - 1, event.id.length);
    console.log(posicion);
    let inputs = document.querySelectorAll('#' + event.id + ' input');
    if ($(inputs[1]).val().search('[a-zA-Z]')!=-1 || $(inputs[2]).val().search('[a-zA-Z]')!=-1){
      Swal.fire({
        title: 'Oops...',
        text: 'No se permiten letras en monto y cantidad',
        icon: 'error',
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
      console.log("console: "+ this.costos[j]);
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
        confirmButtonColor: '#45cb68',
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
        icon: 'error'
      });
      return;
    }

    let inputs = document.querySelectorAll('#' + event.id + ' input');
    //console.log("por que no  entree: " + $(inputs[0]).val() + "  " + $(inputs[1]).val() + " " + $(inputs[2]).val());

    if (($(inputs[0]).val() != '' && $(inputs[1]).val() != '' && $(inputs[2]).val() != '' && $(inputs[3]).val() != '')) {
     // console.log("por que  entree: " + $(inputs[0]).val() + "  " + $(inputs[1]).val() + " " + $(inputs[2]).val());
      this.montoTotal -=parseInt($(inputs[3]).val().substring(1,$(inputs[3]).val().length))
    }
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
  archivo;
  thefile;

    onFileChange(e) {
    console.log(e);
    this.archivosPropuesta = e.target.files;
    //this.arregloArchivosDinamicos.push(this.archivosPropuesta);
    console.log(this.archivosPropuesta);
      this.archivosPropuesta
      //this.fileUrl = e.target.files.createObjectURL(this.archivosPropuesta);

      // window.open(this.fileUrl);

      // const reader = new FileReader();
      //       // // reader.onload = (e: any) => {
      //       // //   console.log("csv content", e.target.result);
      //       // // };
      //       // reader.readAsDataURL(e.target.files[0]);

      // this.thefile = new Blob([e.target.file])
      // console.log(this.thefile);
      // let url = this.thefile.URL.createObjectURL(this.thefile)
        //.archivosPropuestaeObjectURL(this.thefile)

      for (let j = 0; j < this.archivosPropuesta.length; j++) {
        console.log(this.archivosPropuesta[j]);
        this.arregloArchivosDinamicos.push(this.archivosPropuesta[j]);
        this.archivo = { id: '', url: 'http://localhost:3000/ArchivosPropuesta/'+this.archivosPropuesta[j].name, activo: 1, id_propuesta: ''}
        this.archivos.push(this.archivo);
        //console.log(this.archivos);
      }

      // console.log(url)
      // window.open(url)
     // window.open(e.target.files[0].url);
    // var nuevo = $('#tabla' + this.i).clone();
    // $(nuevo).attr('id', 'tabla' + this.i);
    // console.log($(nuevo).attr('id') + this.i);
    // $(nuevo).insertAfter('#tabla' + (this.i - 1));

    // let tr = document.createElement("tr")
    // document.getElementById("tabla").innerHTML += '<td>a</td><td>s</td><td>s</td><td>s</td>';

   // this.archivo = { id: 4, url: 'http://localhost:3000/ArchivosPropuesta/consonantes_3-6990.pdf', activo: true, id_propuesta: 5}
   //  this.archivos.push(this.archivo);
    console.log(this.archivos);
      console.log("archivos dinamicos: "+this.arregloArchivosDinamicos);


    if(this.archivosPropuesta.length == 0){
      this.subir = 'Subir...'
    }else if(this.archivosPropuesta.length == 1){
      this.subir = this.archivosPropuesta[0].name
    }else{
      this.subir = this.archivosPropuesta.length+' archivos'
    }
  }

  upload() {
    console.log('click en imagen');
    let inputFile = document.querySelector('#customFile');
    $(inputFile).click();
  }

  editarPropuesta(): void {
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
        icon: 'error'
      });
      $(form).css({'filter':'blur(0px)'})
      $(generar).attr('disabled', false)
      $(progressbar).css({'display':'none'})
      return;
    }
    vacio = 0;
    let noGuardado = 0;
    console.log(this.costos);
    for (let j = 0; j < this.costos.length; j++) {
      if (this.costos[j][1] == '' || this.costos[j][2] == '' || this.costos[j][3] == '') {
        noGuardado++;
      }
    }
    if (noGuardado > 0) {
      Swal.fire({
        title: 'Oops...',
        text: 'Debes guardar todos los costos que añadiste',
        icon: 'error'
      });
      $(form).css({'filter':'blur(0px)'})
      $(generar).attr('disabled', false)
      $(progressbar).css({'display':'none'})
      return;
    }
    noGuardado = 0;
    let propuesta: IPropuesta = {
      id: this.propuesta.id,
      idPropuesta: `P${this.getReporte().idReporte}`,
      tipo: this.formPropuesta.get('tipo').value,
      descripcion: this.formPropuesta.get('descripcion_propuesta').value,
      razones: this.propuesta.razones,
      Encargado_id: this.getReporte().Encargado_id,
      Reporte_id: this.getReporte().id,
      Finanzas_id: null,
      activo: true,
      fecha: null
    };
    if (this.archivosPropuesta==undefined){
      this.archivosPropuesta = []
    }
    if (this.archivos.length>0){
      console.log(this.archivosPropuesta.length)
      this.propuestaService.update_Propuesta(this.propuesta.id.toString(),propuesta).subscribe((resp: any) => {
        if (resp.success) {
          console.log(resp);
          //let idPropuesta = resp.id;
          let errorCosto = 0
          //Guardar Costos
          for (let j = 0; j < this.costosBaseDeDatos.length; j++) {
            this.costoService.delete(this.costosBaseDeDatos[j].id).subscribe(resp => {
              console.log(resp);
            })
          }
          for (let j = 0; j < this.costos.length; j++) {
            let costo = {
              detalle: this.costos[j][1],
              costo_unitario: this.costos[j][2],
              cantidad: this.costos[j][3],
              id_propuesta: this.propuesta.id
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
            });
            return this.router.navigate(['/dashEncargado/reportes'])
          }

          let formData = new FormData();
          for (let j = 0; j < this.archivosBaseDeDatos.length; j++) {
            if(this.archivosBaseDeDatos[j].activo==0){
              this.archivoService.delete(this.archivosBaseDeDatos[j].id).subscribe(resp =>{
                console.log(resp)
              });
            }
          }
          if(this.arregloArchivosDinamicos.length>0){
            for (let j = 0; j < this.arregloArchivosDinamicos.length; j++) {
              formData.append('archivo', this.archivosPropuesta[j], this.archivosPropuesta[j].name);
            }
            this.archivoService.upload(this.propuesta.id.toString(), formData).subscribe((res: any) => {
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
          }
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
            text:'¡Propuesta actualizada con éxito!',
            icon:'success'
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
        icon: 'error'
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
        icon:'error'
      })
    }else if(code==401){
      Swal.fire({
        title:'Oops',
        text:'No tienes autorización, tu sesión será cerrada',
        icon:'error'
      }).then((result)=>{
        this.authService.logOut()
        this.router.navigate(['/login'])
      })
    }else if(code==403){
      Swal.fire({
        title:'Oops',
        text:'Tu sesión ha expirado, inicia nuevamente',
        icon:'error'
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

  idem:Boolean;
  descartar(i: number) {
    Swal.fire({
      title: '¿Está Seguro?',
      text:"Marcará el reporte como Recepcionado",
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#052a5d',
      cancelButtonColor: '#d33',
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if(result.value){
        if(this.archivos[i].id!=''){
          console.log("entre al if")
          // this.archivos[i].activo = 0;
          this.archivosBaseDeDatos[i].activo = 0;;
          this.idem = true;
          this.contadorDeArchivosBorrados++;
        }else{
          this.idem = false;
        }
        this.archivos.splice(i,1)

        if(!this.idem){
          if(this.archivosBaseDeDatos.length == this.contadorDeArchivosBorrados){
            this.arregloArchivosDinamicos.splice(i,1);

          }else{
            this.arregloArchivosDinamicos.splice(i-1,1);
          }
        }

        // this.arregloArchivosDinamicos.splice(i-1,1);
        console.log(this.arregloArchivosDinamicos)
        console.log(this.archivosBaseDeDatos);
      }
    })
   //    if(this.archivos[i].id!=''){
   //      console.log("entre al if")
   //     // this.archivos[i].activo = 0;
   //      this.archivosBaseDeDatos[i].activo = 0;;
   //      this.idem = true;
   //      this.contadorDeArchivosBorrados++;
   //    }else{
   //      this.idem = false;
   //    }
   //    this.archivos.splice(i,1)
   //
   //    if(!this.idem){
   //      if(this.archivosBaseDeDatos.length == this.contadorDeArchivosBorrados){
   //        this.arregloArchivosDinamicos.splice(i,1);
   //
   //      }else{
   //        this.arregloArchivosDinamicos.splice(i-1,1);
   //      }
   //    }
   //
   // // this.arregloArchivosDinamicos.splice(i-1,1);
   //   console.log(this.arregloArchivosDinamicos)
   //   console.log(this.archivosBaseDeDatos);
  }
}
