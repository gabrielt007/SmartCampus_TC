import { Component, inject, signal, type OnInit } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import type { User } from '../models/user.model';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonButton,
  ],
})
export class Tab3Page implements OnInit {
  private readonly usuariosService = inject(UsuariosService);

  readonly usuarios = signal<User[]>([]);
  readonly cargando = signal(false);
  readonly mensajeError = signal('');

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.mensajeError.set('');

    this.usuariosService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        this.mensajeError.set('No se pudieron cargar los usuarios. Intenta de nuevo.');
        this.cargando.set(false);
        console.error('Error al cargar usuarios:', error);
      },
    });
  }
}
