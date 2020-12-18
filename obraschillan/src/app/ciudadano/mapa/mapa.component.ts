import {Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { IMarcador } from 'src/app/interfaces/marcador.interface';
import {Router} from '@angular/router';
import {MarkerLabel} from '@agm/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnChanges {
  lat = -36.6101444;
  lng = -72.1026896;
  marcador: IMarcador;
  iconMap: any;
  @Output() marcadoSeleccionado: EventEmitter<IMarcador>;
  @Input() latRepo: number
  @Input() longRepo: number

  @Input() categoria: string;
  constructor(public router: Router) {
    this.marcadoSeleccionado= new EventEmitter();
  }

  ngOnInit(): void {

  }

  agregarMarcador( evento ){
    console.log(this.categoria);

    console.log(this.marcador);
    this.marcadoSeleccionado.emit( this.marcador );
  }



  labelOptions: MarkerLabel = {
    color: '#ee4646',
    fontFamily: 'bold',
    fontSize: '0.5px',
    fontWeight: '10px',
    text: 'algooo'
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.categoria != undefined){
      this.lat=this.latRepo
      this.lng=this.longRepo
    }
    console.log("Me estan llamando")
    console.log(this.categoria);   switch(this.categoria){
      case "Luminaria": {
        this.iconMap='../../../assets/luminaria.png'
        break
      }
      case "Obstrucción natural": {
        this.iconMap='../../../assets/natural.png'
        break
      }
      case "Calle sucia": {
        this.iconMap='../../../assets/basura.png'
        break
      }
      case "Tránsito": {
        this.iconMap='../../../assets/transito.png'
        break
      }
    }
  }

}
export interface MarkerLabelP {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  text: string;
}
