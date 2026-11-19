import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { describe, expect, it, vi } from 'vitest';

import { ActividadesService } from '../services/actividades.service';

import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  const actividadesService = {
    listar: vi.fn().mockResolvedValue([]),
    crear: vi.fn().mockResolvedValue('actividad-id'),
    actualizar: vi.fn().mockResolvedValue(undefined),
    eliminar: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      providers: [
        { provide: ActividadesService, useValue: actividadesService },
        { provide: AlertController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('requires all fields and initializes completion as false', () => {
    expect(component).toBeTruthy();
    expect(component.formulario.invalid).toBe(true);
    expect(component.formulario.controls.completada.value).toBe(false);
  });

  it('requires at least ten non-whitespace description characters', () => {
    component.formulario.setValue({
      titulo: 'Proyecto',
      descripcion: ' 12345678 ',
      tipo: 'Proyecto',
      fechaEntrega: '2026-11-25',
      prioridad: 'Alta',
      completada: false,
    });

    expect(component.formulario.controls.descripcion.invalid).toBe(true);

    component.formulario.controls.descripcion.setValue('1234567890');

    expect(component.formulario.controls.descripcion.valid).toBe(true);
  });

  it('saves an activity using the Firestore document shape', async () => {
    component.formulario.setValue({
      titulo: 'Proyecto Ionic',
      descripcion: 'Desarrollar una aplicación móvil',
      tipo: 'Proyecto',
      fechaEntrega: '2026-11-25',
      prioridad: 'Alta',
      completada: false,
    });

    await component.guardarActividad();

    expect(actividadesService.crear).toHaveBeenCalledWith({
      titulo: 'Proyecto Ionic',
      descripcion: 'Desarrollar una aplicación móvil',
      tipo: 'Proyecto',
      fechaEntrega: '2026-11-25',
      prioridad: 'Alta',
      completada: false,
    });
  });
});
