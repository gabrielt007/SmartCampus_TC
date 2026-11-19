import { Component, inject, type OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import {
  PRIORIDADES,
  TIPOS_ACTIVIDAD,
  type Actividad,
  type ActividadData,
  type Prioridad,
  type TipoActividad,
} from '../models/actividad.model';
import { ActividadesService } from '../services/actividades.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonRadioGroup,
    IonRadio,
    IonCheckbox,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
  ],
})
export class Tab2Page implements OnInit {
  private readonly actividadesService = inject(ActividadesService);
  private readonly alertController = inject(AlertController);

  readonly tipos = TIPOS_ACTIVIDAD;
  readonly prioridades = PRIORIDADES;
  readonly formulario = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        (control) => {
          const actualLength = typeof control.value === 'string' ? control.value.trim().length : 0;
          return actualLength >= 10 ? null : { minlength: { requiredLength: 10, actualLength } };
        },
        Validators.pattern(/\S/),
      ],
    }),
    tipo: new FormControl<TipoActividad | null>(null, Validators.required),
    fechaEntrega: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
    }),
    prioridad: new FormControl<Prioridad | null>(null, Validators.required),
    completada: new FormControl(false, { nonNullable: true }),
  });

  actividades: Actividad[] = [];
  editandoId: string | null = null;
  cargando = false;
  guardando = false;
  mensajeError = '';

  ngOnInit(): void {
    void this.cargarActividades();
  }

  async cargarActividades(): Promise<void> {
    this.cargando = true;
    this.mensajeError = '';

    try {
      this.actividades = await this.actividadesService.listar();
    } catch (error) {
      this.mensajeError = 'No se pudieron cargar las actividades. Intenta de nuevo.';
      console.error('Error al cargar actividades:', error);
    } finally {
      this.cargando = false;
    }
  }

  onFechaChange(event: CustomEvent<{ value?: string | string[] | null }>): void {
    const value = event.detail.value;
    this.formulario.controls.fechaEntrega.setValue(typeof value === 'string' ? value.slice(0, 10) : '');
    this.formulario.controls.fechaEntrega.markAsTouched();
  }

  async guardarActividad(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const values = this.formulario.getRawValue();
    if (values.tipo === null || values.prioridad === null) {
      return;
    }

    const actividad: ActividadData = {
      titulo: values.titulo.trim(),
      descripcion: values.descripcion.trim(),
      tipo: values.tipo,
      fechaEntrega: values.fechaEntrega.slice(0, 10),
      prioridad: values.prioridad,
      completada: values.completada,
    };

    this.guardando = true;
    this.mensajeError = '';

    try {
      if (this.editandoId === null) {
        await this.actividadesService.crear(actividad);
      } else {
        await this.actividadesService.actualizar(this.editandoId, actividad);
      }
      this.limpiarFormulario();
      await this.cargarActividades();
    } catch (error) {
      this.mensajeError = 'No se pudo guardar la actividad. Verifica tu conexión e inténtalo de nuevo.';
      console.error('Error al guardar actividad:', error);
    } finally {
      this.guardando = false;
    }
  }

  editarActividad(actividad: Actividad): void {
    this.editandoId = actividad.id;
    this.formulario.setValue({
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      tipo: actividad.tipo,
      fechaEntrega: actividad.fechaEntrega.slice(0, 10),
      prioridad: actividad.prioridad,
      completada: actividad.completada,
    });
    this.mensajeError = '';
  }

  async confirmarEliminacion(actividad: Actividad): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar actividad',
      message: `¿Quieres eliminar "${actividad.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'confirm' },
      ],
    });
    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
      await this.eliminarActividad(actividad.id);
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.formulario.reset({
      titulo: '',
      descripcion: '',
      tipo: null,
      fechaEntrega: '',
      prioridad: null,
      completada: false,
    });
  }

  private async eliminarActividad(id: string): Promise<void> {
    this.mensajeError = '';

    try {
      await this.actividadesService.eliminar(id);
      await this.cargarActividades();
    } catch (error) {
      this.mensajeError = 'No se pudo eliminar la actividad. Inténtalo de nuevo.';
      console.error('Error al eliminar actividad:', error);
    }
  }
}
