import { Injectable } from '@angular/core';

import type { LecturaAcelerometro } from '../models/dispositivo.model';

const CLAVE_NOMBRE_ESTUDIANTE = 'smartcampus_nombre_estudiante';

@Injectable({ providedIn: 'root' })
export class DispositivoService {
  private removerListener: (() => void) | null = null;

  async obtenerNombreEstudiante(): Promise<string> {
    try {
      const valor = localStorage.getItem(CLAVE_NOMBRE_ESTUDIANTE);
      return valor ? valor.trim() : '';
    } catch {
      return '';
    }
  }

  async guardarNombreEstudiante(nombre: string): Promise<void> {
    const limpio = nombre.trim();
    localStorage.setItem(CLAVE_NOMBRE_ESTUDIANTE, limpio);
  }

  async iniciarLecturaAcelerometro(
    onLectura: (lectura: LecturaAcelerometro) => void,
    onNoDisponible: () => void,
    onError: (error: unknown) => void,
  ): Promise<boolean> {
    this.detenerLecturaAcelerometro();

    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      onNoDisponible();
      return false;
    }

    try {
      const MotionEventCtor = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof MotionEventCtor.requestPermission === 'function') {
        const permiso = await MotionEventCtor.requestPermission();
        if (permiso !== 'granted') {
          onNoDisponible();
          return false;
        }
      }

      const handler = (event: DeviceMotionEvent): void => {
        const acc = event.accelerationIncludingGravity ?? event.acceleration;
        if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
          onLectura({
            x: Number(acc.x.toFixed(2)),
            y: Number(acc.y.toFixed(2)),
            z: Number(acc.z.toFixed(2)),
          });
        }
      };

      window.addEventListener('devicemotion', handler);
      this.removerListener = () => {
        window.removeEventListener('devicemotion', handler);
      };

      return true;
    } catch (error) {
      onError(error);
      return false;
    }
  }

  detenerLecturaAcelerometro(): void {
    if (this.removerListener) {
      this.removerListener();
      this.removerListener = null;
    }
  }
}