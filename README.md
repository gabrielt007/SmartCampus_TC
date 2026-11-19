# SmartCampus (`SmartCampus_TC`)

Aplicación móvil híbrida desarrollada con **Ionic**, **Angular** y **Capacitor**, orientada a la gestión académica y a la integración de funciones nativas del dispositivo móvil.

---

## Descripción general

**SmartCampus** centraliza cuatro módulos principales en una navegación por pestañas (`ion-tabs`):

1. **Inicio (`/tabs/inicio`)**
   - Presentación general del proyecto, fecha actual formateada (`es-EC`), listado de integrantes y tarjetas de acceso rápido hacia cada módulo.
2. **Actividades (`/tabs/actividades`)**
   - Gestión CRUD completa (crear, listar, editar y eliminar con confirmación) de actividades académicas conectada a **Cloud Firestore (Firebase)**.
   - Validación reactiva de formularios (`titulo`, `descripcion` de al menos 10 caracteres, `tipo`, `fechaEntrega`, `prioridad` y estado `completada`).
3. **Usuarios (`/tabs/usuarios`)**
   - Consumo de servicio REST externo (`[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)`) mediante `HttpClient` y señales (`signal`).
   - Manejo de estados de carga (`ion-spinner`), manejo de errores con opción de reintento y visualización de datos de contacto.
4. **Dispositivo (`/tabs/dispositivo`)**
   - **Acelerómetro:** lectura en tiempo real de los ejes `X`, `Y` y `Z` mediante `DeviceMotionEvent`, control de inicio/detención, liberación automática de listeners al salir o destruir la vista y manejo cuando el sensor no está disponible o el permiso es denegado.
   - **Almacenamiento local:** persistencia del nombre del estudiante mediante almacenamiento local (`localStorage` / `@capacitor/preferences`) con carga automática al iniciar la vista.

---

## Tecnologías y versiones principales

- **Angular:** `22.2.6` (componentes *standalone* y *Signals*)
- **Ionic Framework:** `^9.0.0`
- **Capacitor:** `8.6.2` (`@capacitor/app`, `@capacitor/core`, `@capacitor/haptics`, `@capacitor/keyboard`, `@capacitor/preferences`, `@capacitor/status-bar`)
- **Backend / Base de datos:** Firebase / Cloud Firestore (`^13.4.0`)
- **Pruebas:** Vitest (`^5.1.0`) para pruebas unitarias y Playwright (`^1.64.1`) para pruebas E2E
- **Calidad de código:** ESLint (`angular-eslint` + `@ionic/eslint-config`) y Prettier

---

## Estructura del proyecto

```text
SmartCampus_TC/
├── e2e/                        # Pruebas End-to-End con Playwright
├── src/
│   ├── app/
│   │   ├── models/             # Interfaces y tipos (actividad, usuario, dispositivo)
│   │   ├── services/           # Servicios (Firebase, Actividades, Usuarios, Dispositivo)
│   │   ├── tab1/               # Módulo Inicio
│   │   ├── tab2/               # Módulo Actividades académicas
│   │   ├── tab3/               # Módulo Usuarios
│   │   ├── tab4/               # Módulo Dispositivo (Acelerómetro + Almacenamiento local)
│   │   ├── tabs/               # Contenedor de pestañas y enrutamiento hijo
│   │   ├── app.component.ts    # Componente raíz
│   │   └── app.routes.ts       # Rutas principales
│   ├── environments/           # Configuración de entorno y credenciales de Firebase
│   └── theme/                  # Variables de tema de Ionic
├── angular.json
├── capacitor.config.ts
├── ionic.config.json
└── package.json
```

---

## Instalación y ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar en servidor de desarrollo (navegador)

```bash
npm start
```

La aplicación estará disponible por defecto en `http://localhost:4200`.

### 3. Compilar para producción

```bash
npm run build
```

### 4. Sincronizar y ejecutar en dispositivo móvil (Capacitor)

```bash
npm run build
npx cap sync
npx cap open android
```

> **Nota sobre el acelerómetro:** en navegadores de escritorio sin hardware de movimiento, el módulo informa que el sensor no está disponible o mantiene los ejes en `0` sin generar errores. Para probar lecturas reales en movimiento, ejecútalo en un dispositivo físico Android/iOS o usa la herramienta **Sensors** de Chrome DevTools.

---

## Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo de Angular (`ng serve`). |
| `npm run build` | Genera la compilación web en la carpeta `www/`. |
| `npm run test:unit` | Ejecuta las pruebas unitarias con Vitest. |
| `npm run test:e2e` | Ejecuta las pruebas End-to-End con Playwright. |
| `npm test` | Ejecuta pruebas unitarias y E2E. |
| `npm run lint` | Verifica reglas de ESLint, tipos E2E y formato Prettier. |
| `npm run lint:fix` | Corrige automáticamente problemas de ESLint y Prettier. |
```
