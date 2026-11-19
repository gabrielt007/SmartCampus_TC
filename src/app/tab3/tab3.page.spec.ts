import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Tab3Page } from './tab3.page';

describe('Tab3Page', () => {
  let fixture: ComponentFixture<Tab3Page>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users').flush([]);
  });

  it('displays users returned by the service', async () => {
    httpTestingController.expectOne('https://jsonplaceholder.typicode.com/users').flush([
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'leanne@example.com',
        phone: '123-456',
        website: 'example.com',
      },
    ]);
    await fixture.whenStable();
    expect(fixture.componentInstance.usuarios()).toHaveLength(1);
    expect(fixture.componentInstance.cargando()).toBe(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Leanne Graham');
    expect(fixture.nativeElement.textContent).toContain('leanne@example.com');
    expect(fixture.nativeElement.textContent).toContain('123-456');
    expect(fixture.nativeElement.textContent).toContain('example.com');
  });

  it('shows an error and retry option when the request fails', async () => {
    httpTestingController
      .expectOne('https://jsonplaceholder.typicode.com/users')
      .error(new ProgressEvent('network error'));
    await fixture.whenStable();
    expect(fixture.componentInstance.mensajeError()).toContain('No se pudieron cargar los usuarios.');
    expect(fixture.componentInstance.cargando()).toBe(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No se pudieron cargar los usuarios.');
    expect(fixture.nativeElement.textContent).toContain('Reintentar');
  });
});
