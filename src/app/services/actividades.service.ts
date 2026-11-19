import { Injectable, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';

import type { Actividad, ActividadData } from '../models/actividad.model';

import { FirebaseService } from './firebase.service';

@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private readonly firebase = inject(FirebaseService);
  private readonly actividades = collection(this.firebase.firestore, 'actividades');

  async listar(): Promise<Actividad[]> {
    const resultado = await getDocs(query(this.actividades, orderBy('fechaEntrega', 'asc')));

    return resultado.docs.map((documento) => ({
      ...(documento.data() as ActividadData),
      id: documento.id,
    }));
  }

  async crear(actividad: ActividadData): Promise<string> {
    const documento = await addDoc(this.actividades, actividad);
    return documento.id;
  }

  async actualizar(id: string, actividad: ActividadData): Promise<void> {
    await updateDoc(doc(this.actividades, id), actividad);
  }

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(this.actividades, id));
  }
}
