# Frontend - SembrandoBits

Este directorio contiene el frontend de **SembrandoBits**, una aplicación React + TypeScript construida con Vite para visualizar datos de sensores IoT de suelo y aire y ofrecer recomendaciones de cultivos.

---

## 1. Tecnologías principales

- **React** + **TypeScript**
- **Vite** como bundler y dev server
- **TailwindCSS / clases utilitarias** para estilos
- **lucide-react** para iconos
- **sonner** para notificaciones (toasts)

---

## 2. Scripts disponibles

Desde la carpeta `frontend/`:

```bash
npm install          # Instala dependencias
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Genera build de producción
npm run preview      # Previsualiza el build de producción
```

Por defecto, Vite se ejecuta en `http://localhost:5173`.

> Asegúrate de tener el backend Flask corriendo (por defecto en `http://localhost:8860`) para que la app pueda consumir los datos.

---

## 3. Estructura principal

```bash
frontend/
├── src/
│   ├── main.tsx             # Punto de entrada de React
│   ├── App.tsx              # Enrutamiento simple y layout
│   ├── components/
│   │   ├── Home.tsx         # Pantalla principal para agricultoras
│   │   ├── LandingPage.tsx  # Pantalla de bienvenida/landing
│   │   ├── SelectionPage.tsx# Selección guiada de medio/dispositivo/cultivo
│   │   ├── SensorManagement.tsx # Panel de administración
│   │   ├── Calificaciones.tsx   # Gestión y análisis de votaciones
│   │   ├── ApiTester.tsx    # Probador de API del backend
│   │   ├── ui/              # Componentes de UI reutilizables (botón, tarjeta, tabla,...)
│   │   └── figma/           # `ImageWithFallback` y elementos de diseño
│   └── styles/
│       └── globals.css      # Estilos globales
└── index.html               # Contenedor raíz
```

---

## 4. Rutas y vistas

La aplicación se estructura principalmente en dos vistas clave:

1. **Pantalla principal (`Home`)**
   - Muestra introducción al proyecto SembrandoBits.
   - Permite seleccionar **medio** (`terreno` o `aire`).
   - Permite seleccionar **dispositivo lógico** (1, 2, 3, 4 si existen).
   - Permite seleccionar un **cultivo** y ver el análisis de compatibilidad.
   - Muestra datos de sensores con estados de carga suaves (skeletons y transiciones).
   - Permite enviar una **calificación** (1–5 estrellas) de la experiencia.

2. **Panel de administración (`SensorManagement`)** – Ruta: `/sensor-management`
   - Pensado para administradores del sistema.
   - Incluye pestañas para:
     - Gestión de sensores, medidas y dispositivos.
     - **Calificaciones**: ver últimas votaciones, estadísticas y borrar todas las calificaciones (`DELETE /votaciones`).
   - Usa los mismos componentes de UI (`ui/*`) para mantener consistencia visual.

> La navegación hacia `/sensor-management` suele hacerse manualmente escribiendo la URL en el navegador durante desarrollo.

---

## 5. Comunicación con el backend

- El frontend se comunica con la API Flask expuesta (por defecto) en `http://localhost:8860`.
- Endpoints usados más relevantes:
  - `/medidas/dispositivo/<id>`: obtener últimos datos de un dispositivo lógico.
  - `/votacion`: guardar una votación/calificación.
  - `/votaciones`: listar votaciones (con filtros y `limit`).
  - `/votaciones/estadisticas`: obtener estadísticas de calificaciones.
  - `/votaciones` (DELETE): borrar todas las votaciones (solo panel admin).

La URL base puede estar centralizada en utilidades o variables según la configuración del entorno.

---

## 6. Buenas prácticas dentro del proyecto

- Mantener la lógica compleja (por ejemplo, cálculo de compatibilidad de cultivos) encapsulada en funciones dentro de `Home.tsx` o extraerla a helpers reutilizables si crece.
- Reutilizar componentes de la carpeta `ui/` para botones, tarjetas, tablas, formularios, etc.
- Mantener la documentación funcional en la carpeta `documentacion/` del proyecto raíz.
- Usar `ApiTester.tsx` para probar rápidamente la comunicación con el backend durante el desarrollo.

---

## 7. Próximos pasos sugeridos

- Añadir autenticación/roles para separar claramente el acceso de agricultoras y administradores.
- Internacionalizar la interfaz (multi-idioma).
- Añadir más visualizaciones históricas (gráficas) para las medidas.

Este README está orientado a desarrolladores que quieran levantar o modificar el frontend de SembrandoBits.
