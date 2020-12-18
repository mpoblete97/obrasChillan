export interface IReporte {
  id: number;
  idReporte:string;
  fecha: string;
  descripcion: string;
  razones: string;
  estado: string;
  latitud: number;
  longitud: number;
  Encargado_id: number;
  Ciudadano_id: number;
  activo: boolean;
  direccion: string;
}
