export interface IPropuesta {
  id: number;
  idPropuesta:string;
  tipo: string;
  descripcion: string;
  razones: string;
  Encargado_id: number;
  Finanzas_id: number;
  Reporte_id: number;
  activo: boolean;
  fecha: string;
}
