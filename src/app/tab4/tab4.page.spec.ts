import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DispositivoService } from '../../services/dispositivo.service';

import { Tab4Page } from './tab4.page';

describe('Tab4Page', () => {
  let component: Tab4Page;
  let fixture: ComponentFixture<Tab4Page>;

  const dispositivoServiceMock = {
    obtenerNombreEstudiante: vi.fn().mockResolvedValue('Josué'),
    guardarNombreEstudiante: vi.fn().mockResolvedValue(undefined),
    iniciarLecturaAcelerometro: vi.fn().mockResolvedValue(true),
    detenerLecturaAcelerometro: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    dispositivoServiceMock.obtenerNombreEstudiante.mockResolvedValue('Josué');
    dispositivoServiceMock.iniciarLecturaAcelerometro.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [Tab4Page],
      providers: [{ provide: DispositivoService, useValue: dispositivoServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load saved student name on init', () => {
    expect(component).toBeTruthy();
    expect(dispositivoServiceMock.obtenerNombreEstudiante).toHaveBeenCalledTimes(1);
    expect(component.nombreGuardado()).toBe('Josué');
  });

  it('starts and stops accelerometer reading and cleans up on destroy', async () => {
    await component.iniciarLectura();
    expect(dispositivoServiceMock.iniciarLecturaAcelerometro).toHaveBeenCalledTimes(1);
    expect(component.estadoSensor()).toBe('activo');

    component.detenerLectura();
    expect(dispositivoServiceMock.detenerLecturaAcelerometro).toHaveBeenCalledTimes(1);
    expect(component.estadoSensor()).toBe('inactivo');

    fixture.destroy();
    expect(dispositivoServiceMock.detenerLecturaAcelerometro).toHaveBeenCalledTimes(2);
  });

  it('shows an informative message when the accelerometer is unavailable', async () => {
    dispositivoServiceMock.iniciarLecturaAcelerometro.mockImplementationOnce(
      async (_onLectura, onNoDisponible) => {
        onNoDisponible();
        return false;
      },
    );

    await component.iniciarLectura();

    expect(component.estadoSensor()).toBe('no-disponible');
    expect(component.mensajeSensor()).toContain('no está disponible');
  });

  it('saves a trimmed student name to local storage', async () => {
    component.nombreEstudiante.set('  Ana Pérez  ');
    await component.guardarNombre();

    expect(dispositivoServiceMock.guardarNombreEstudiante).toHaveBeenCalledWith('Ana Pérez');
    expect(component.nombreGuardado()).toBe('Ana Pérez');
  });
});