export interface LecturaAcelerometro {
  x: number;
  y: number;
  z: number;
}

export type EstadoSensor = 'inactivo' | 'activo' | 'no-disponible' | 'error';

export interface DatosEstudiante {
  nombre: string;
}
