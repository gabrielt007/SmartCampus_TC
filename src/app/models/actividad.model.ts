export const TIPOS_ACTIVIDAD = ['Tarea', 'Proyecto', 'Examen', 'Investigación', 'Taller'] as const;

export type TipoActividad = (typeof TIPOS_ACTIVIDAD)[number];

export const PRIORIDADES = ['Alta', 'Media', 'Baja'] as const;

export type Prioridad = (typeof PRIORIDADES)[number];

export type ActividadData = {
  titulo: string;
  descripcion: string;
  tipo: TipoActividad;
  fechaEntrega: string;
  prioridad: Prioridad;
  completada: boolean;
};

export interface Actividad extends ActividadData {
  id: string;
}
