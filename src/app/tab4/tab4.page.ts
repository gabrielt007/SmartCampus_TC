import { Component, inject, signal, type OnDestroy, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import type { EstadoSensor, LecturaAcelerometro } from '../models/dispositivo.model';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonItem,
    IonNote,
    IonButton,
  ],
})
export class Tab4Page implements OnInit, OnDestroy {
  private readonly dispositivoService = inject(DispositivoService);

  readonly lectura = signal<LecturaAcelerometro>({ x: 0, y: 0, z: 0 });
  readonly estadoSensor = signal<EstadoSensor>('inactivo');
  readonly mensajeSensor = signal('');

  readonly nombreEstudiante = signal('');
  readonly nombreGuardado = signal('');
  readonly mensajeAlmacenamiento = signal('');
  readonly guardandoNombre = signal(false);

  async ngOnInit(): Promise<void> {
    await this.cargarNombreGuardado();
  }

  ionViewWillLeave(): void {
    this.detenerLectura();
  }

  ngOnDestroy(): void {
    this.detenerLectura();
  }

  async iniciarLectura(): Promise<void> {
    this.mensajeSensor.set('');

    const iniciado = await this.dispositivoService.iniciarLecturaAcelerometro(
      (nuevaLectura) => {
        this.lectura.set(nuevaLectura);
        this.estadoSensor.set('activo');
      },
      () => {
        this.estadoSensor.set('no-disponible');
        this.mensajeSensor.set(
          'El sensor de acelerómetro no está disponible o el permiso fue denegado en este dispositivo.',
        );
      },
      (error: unknown) => {
        this.estadoSensor.set('error');
        this.mensajeSensor.set('Ocurrió un problema al iniciar la lectura del acelerómetro.');
        console.error('Error en acelerómetro:', error);
      },
    );

    if (iniciado && this.estadoSensor() !== 'activo') {
      this.estadoSensor.set('activo');
    }
  }

  detenerLectura(): void {
    this.dispositivoService.detenerLecturaAcelerometro();
    if (this.estadoSensor() === 'activo') {
      this.estadoSensor.set('inactivo');
    }
  }

  async guardarNombre(): Promise<void> {
    const limpio = this.nombreEstudiante().trim();
    if (!limpio) {
      this.mensajeAlmacenamiento.set('Ingresa un nombre antes de guardar.');
      return;
    }

    this.guardandoNombre.set(true);
    this.mensajeAlmacenamiento.set('');

    try {
      await this.dispositivoService.guardarNombreEstudiante(limpio);
      this.nombreEstudiante.set(limpio);
      this.nombreGuardado.set(limpio);
      this.mensajeAlmacenamiento.set('Nombre guardado correctamente.');
    } catch (error) {
      this.mensajeAlmacenamiento.set('No se pudo guardar el nombre.');
      console.error('Error al guardar nombre:', error);
    } finally {
      this.guardandoNombre.set(false);
    }
  }

  private async cargarNombreGuardado(): Promise<void> {
    const guardado = await this.dispositivoService.obtenerNombreEstudiante();
    if (guardado) {
      this.nombreEstudiante.set(guardado);
      this.nombreGuardado.set(guardado);
    }
  }
}