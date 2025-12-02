# Arquitectura y Decisiones de Diseño - SembrandoBits

Este documento resume las decisiones técnicas y de diseño más importantes tomadas en el proyecto SembrandoBits.

---

## 1. Arquitectura general

- **Frontend:** React + TypeScript usando Vite.
- **Backend:** Flask (Python) exponiendo una API REST.
- **Base de datos:** MongoDB.
- **Comunicación:** El frontend consume la API en `http://127.0.0.1:8860` durante desarrollo.
- **IoT:** Dispositivos físicos (sensores) que envían datos de suelo y aire, almacenados en MongoDB y expuestos vía API.

**Razones principales:**
- React + Vite ofrece una experiencia rápida de desarrollo y una UI reactiva para mostrar datos en tiempo real.
- Flask es ligero y fácil de integrar con MongoDB y con blueprints para separar módulos.
- MongoDB se adapta bien a datos semiestructurados de sensores y votaciones.

---

## 2. Organización del backend

- El backend se encuentra en la carpeta `backend/`.
- Se utiliza `servidor.py` como punto de entrada de la API.
- Se usan **Blueprints** para separar responsabilidades:
  - `sensores.py`: gestión de sensores.
  - `medidas.py`: gestión de medidas/lecturas.
  - `dispositivos.py`: gestión de dispositivos lógicos.
  - `votaciones.py`: gestión de calificaciones de usuarios.
- `database.py` contiene la lógica de conexión a MongoDB y helpers para logging de errores.

**Decisión:** separar en blueprints para que cada área (sensores, medidas, votos, dispositivos) pueda evolucionar sin mezclar responsabilidades.

---

## 3. Organización del frontend

- El frontend vive en la carpeta `frontend/` y se construye con Vite + React + TypeScript.
- Estructura principal de componentes:
  - `src/components/Home.tsx`: pantalla principal de consulta para la agricultora.
  - `src/components/SensorManagement.tsx`: panel de administración `/sensor-management` con pestañas.
  - `src/components/Calificaciones.tsx`: componente interno usado en la pestaña de calificaciones del panel admin.
  - Carpeta `src/components/ui/`: colección de componentes de interfaz reutilizables (botones, tarjetas, tablas, formularios, etc.).

**Decisión:** concentrar la experiencia principal en un solo componente de alto nivel (`Home`) y delegar la administración y vistas más avanzadas a `SensorManagement`.

---

## 4. Decisión: compatibilidad de cultivos basada en todos los dispositivos

### Contexto

Originalmente, el análisis de compatibilidad de cultivos dependía del dispositivo seleccionado (1, 2 o 3). Esto provocaba que, al cambiar de dispositivo, la predicción cambiara, generando confusión.

### Decisión tomada

- La función `calculateCropCompatibility` en `Home.tsx` ahora:
  - Recorre los datos de todos los dispositivos lógicos de terreno (1, 2, 3 y 4 si aplica).
  - Combina las lecturas promediando los campos cuando hay varios dispositivos.
  - Usa esa **vista agregada** para comparar con los rangos ideales de cada cultivo.

### Motivo

- La agricultora quiere una predicción **única y estable** por cultivo, basada en todos los sensores disponibles, sin que cambie al alternar el dispositivo seleccionado.
- Se reduce la confusión y se refuerza la idea de que el sistema da una recomendación global del lote.

---

## 5. Decisión: manejo de carga y "lag" visual en Home

### Problema

- La carga de tarjetas de sensores y cultivos podía dar sensación de "lag" o lentitud.

### Solución adoptada

- Uso de estados de carga en `Home.tsx`:
  - `isInitialLoading`: indica si es la primera carga de datos.
  - `isUpdating`: indica si se está refrescando información.
  - `lastSensorData`: guarda los últimos datos válidos para mostrar algo aunque falle un fetch.
- Mostrar **skeletons** (tarjetas grises) durante la carga inicial.
- Aplicar transiciones de opacidad cuando se están actualizando datos, en lugar de vaciar y volver a llenar las tarjetas.

### Razón

- Se priorizó una experiencia suave para la usuaria, donde siempre vea algún dato (aunque sea el último conocido) y nunca un parpadeo brusco.

---

## 6. Decisión: no usar virtualización en la grilla de cultivos

### Contexto

- Se evaluó usar `react-window` para virtualizar la grilla de cultivos y mejorar rendimiento al hacer scroll.
- Durante las pruebas aparecieron problemas de tipos/exports y complejidad adicional.

### Decisión tomada

- Volver a una grilla simple con `crops.map(...)` en `Home.tsx`.
- Mantener una cantidad razonable de cultivos para que el rendimiento siga siendo bueno sin necesidad de virtualización.

### Motivo

- La prioridad era mantener el código estable, legible y fácil de mantener.
- El beneficio real de la virtualización no compensaba la complejidad añadida en este caso.

---

## 7. Decisión: gestión de calificaciones y panel administrativo

### Recolección de calificaciones

- Las calificaciones se envían desde el frontend principal mediante `POST /votacion`.
- Se almacena:
  - `rating` (1 a 5).
  - `dispositivo` (si se seleccionó alguno).
  - `cultivo` (si se seleccionó alguno).
  - `medio` ("terreno" o "aire").
  - `timestamp` y `fecha`.

### Panel de administración

- La revisión de calificaciones NO se mezcla con la experiencia de la agricultora.
- Existe una ruta dedicada `/sensor-management` donde se encuentra el panel de administración.
- Dentro de ese panel, la pestaña **Calificaciones** muestra:
  - Estadísticas agregadas (`/votaciones/estadisticas`).
  - Últimas 50 votaciones (`/votaciones?limit=50`).
  - Botón para **borrar todas** las calificaciones (`DELETE /votaciones`).

### Motivo

- Separar claramente la experiencia de usuario final de la vista administrativa.
- Permitir a administradores limpiar datos de prueba y analizar satisfacción global.

---

## 8. Decisión: estructura de documentación

- Toda la documentación funcional y técnica se ubica en la carpeta `documentacion/`:
  - `USER_MANUAL.md`: manual de usuario final.
  - `USER_MANUAL_ADMIN.md`: manual del panel de administración.
  - `HISTORIAS_DE_USUARIO.md`: historias de usuario para diferentes actores.
  - `DIAGRAMAS_Y_CASOS_DE_USO.md`: explicación textual de diagramas y casos de uso.
  - `ARQUITECTURA_Y_DECISIONES.md`: este documento de decisiones.

### Motivo

- Centralizar toda la documentación, facilitando su consulta y evitando duplicados dispersos entre `backend/` y `frontend/`.

---

## 9. Posibles decisiones futuras

- Añadir autenticación y roles (agricultora, administrador, soporte).
- Exponer más métricas históricas y gráficos en el panel admin.
- Incluir internacionalización (i18n) para otros idiomas además de español.
- Integrar alertas automáticas cuando ciertos parámetros críticos se salgan de rango.
