# Diagramas y Casos de Uso - SembrandoBits

Este documento resume, en forma textual, los principales diagramas lógicos y casos de uso de la plataforma SembrandoBits. Puede usarse como base para crear diagramas visuales en herramientas como Draw.io, Lucidchart, Figma u otras.

---

## 1. Diagrama de alto nivel (contexto)

**Actores principales:**
- Agricultora / Usuario final.
- Administrador de la plataforma.
- Sistema SembrandoBits (Frontend Web).
- API Backend Flask.
- Base de datos (MongoDB).
- Dispositivos IoT (sensores de suelo y aire).

**Flujo general:**
1. La Agricultora abre la aplicación web en el navegador.
2. El Frontend solicita datos al Backend (dispositivos, sensores, medidas, votaciones).
3. El Backend consulta la base de datos y retorna la información solicitada.
4. Los Dispositivos IoT envían periódicamente lecturas de sensores que se almacenan en la base de datos.
5. La Agricultora interactúa con la interfaz (selecciona medio, dispositivo, cultivo, etc.) y recibe análisis en tiempo real.
6. La Agricultora puede enviar una calificación (votación) que se registra en la base de datos.
7. El Administrador accede al panel `/sensor-management` para revisar y gestionar sensores y calificaciones.

---

## 2. Diagrama lógico de módulos (texto)

**Frontend (Vite + React + TypeScript):**
- `Home`: pantalla principal de información para la Agricultora.
  - Secciones: Hero, Selección de Medio, Terreno, Aire, Compatibilidad de Cultivos, Recomendaciones, Calificación.
- `SensorManagement`: panel administrativo con pestañas.
  - Lista de Sensores.
  - Vincular Sensores.
  - Últimas Medidas.
  - Calificaciones (usa componente `Calificaciones`).
- `Calificaciones`: panel de estadísticas y listado de votaciones.
- Componentes UI reutilizables (buttons, cards, tablas, etc.).

**Backend (Flask):**
- Blueprint `sensores`.
- Blueprint `medidas`.
- Blueprint `dispositivos`.
- Blueprint `votaciones`.
- Módulo `database` (conexión a MongoDB y helpers).

**Base de datos (MongoDB):**
- Colección `sensores`.
- Colección `medidas`.
- Colección `dispositivos`.
- Colección `votaciones`.

---

## 3. Diagrama de casos de uso - Agricultora

### CU-01: Consultar estado de sensores de terreno
**Actor:** Agricultora

**Flujo principal:**
1. La Agricultora abre la página principal.
2. Selecciona el medio **Terreno**.
3. El sistema muestra los botones de **Dispositivo 1, 2 y 3**.
4. La Agricultora selecciona un dispositivo.
5. El sistema consulta el backend (`/dispositivo/<id>`) y muestra las tarjetas de sensores de suelo.

### CU-02: Analizar compatibilidad de un cultivo
**Actor:** Agricultora

**Flujo principal:**
1. Con el medio **Terreno** seleccionado, la Agricultora baja a la sección de **cultivos**.
2. Selecciona un cultivo de la grilla.
3. El sistema combina datos de todos los dispositivos de suelo disponibles.
4. El sistema calcula el nivel de compatibilidad (Compatible, Revisar, No compatible).
5. El sistema muestra:
   - Estado visual (íconos y etiquetas).
   - Texto de recomendación.
   - Rangos ideales de humedad, pH y nutrientes.

### CU-03: Consultar calidad del aire
**Actor:** Agricultora

**Flujo principal:**
1. La Agricultora selecciona el medio **Aire**.
2. El sistema obtiene datos de sensores de aire (temperatura, humedad relativa, gases).
3. El sistema calcula la calidad de aire (bueno, moderado, malo).
4. El sistema muestra el indicador y las tarjetas con los valores.

### CU-04: Calificar la utilidad de la información
**Actor:** Agricultora

**Flujo principal:**
1. La Agricultora se desplaza a la sección de **Calificación**.
2. Selecciona de 1 a 5 estrellas.
3. Presiona el botón **“Volver al inicio”**.
4. El sistema envía la votación al backend (`POST /votacion`).
5. El sistema muestra un mensaje de confirmación.

---

## 4. Diagrama de casos de uso - Administrador

### CU-ADM-01: Acceder al panel de administración
**Actor:** Administrador

**Flujo principal:**
1. El Administrador abre la URL del panel: `http://localhost:5173/sensor-management` (o la URL equivalente en producción).
2. El sistema muestra el panel de gestión de sensores.

### CU-ADM-02: Revisar calificaciones
**Actor:** Administrador

**Flujo principal:**
1. Desde el panel, el Administrador entra a la pestaña **Calificaciones**.
2. El sistema llama a `GET /votaciones?limit=50` y `GET /votaciones/estadisticas`.
3. El sistema muestra:
   - Total de votaciones.
   - Promedio general.
   - Distribución por estrellas.
   - Tabla con las últimas 50 calificaciones.

### CU-ADM-03: Actualizar estadísticas de calificaciones
**Actor:** Administrador

**Flujo principal:**
1. En la pestaña **Calificaciones**, el Administrador presiona el botón **Actualizar**.
2. El sistema vuelve a solicitar los datos al backend.
3. Las estadísticas y la tabla se refrescan con la información más reciente.

### CU-ADM-04: Borrar todas las calificaciones
**Actor:** Administrador

**Flujo principal:**
1. En la pestaña **Calificaciones**, el Administrador presiona el botón **Borrar todo**.
2. El sistema muestra un cuadro de confirmación.
3. El Administrador confirma la acción.
4. El sistema envía `DELETE /votaciones` al backend.
5. El backend borra todos los documentos de la colección `votaciones`.
6. El sistema muestra un mensaje de éxito y permite refrescar la vista.

**Flujo alterno (error):**
- Si el backend responde con error, el sistema muestra un mensaje indicando que no se pudieron borrar las calificaciones.

---

## 5. Diagrama de casos de uso - Soporte técnico

### CU-SOP-01: Verificar estado del servidor y base de datos
**Actor:** Soporte técnico

**Flujo principal:**
1. Soporte accede al endpoint de prueba (por ejemplo `/test-db` o `/`).
2. El backend responde indicando si la conexión a la base de datos es correcta.
3. Soporte decide si debe intervenir en la infraestructura o en la aplicación.

### CU-SOP-02: Diagnosticar problemas con sensores
**Actor:** Soporte técnico / Técnica de campo

**Flujo principal:**
1. Soporte revisa en el panel (o en logs) si las medidas de sensores se actualizan.
2. Si no hay datos recientes, verifica:
   - Conectividad de los dispositivos IoT.
   - Estado de la red.
   - Registros de la API.
3. Informa al equipo de campo si hay que revisar físicamente los dispositivos.

---

## 6. Notas para creación de diagramas visuales

A partir de este documento se pueden construir diagramas formales:

- **Diagrama de contexto**: dibujar al usuario final, administrador, dispositivos IoT, frontend, backend y base de datos, con flechas que indiquen el flujo de información.
- **Diagrama de componentes**: representar módulos frontend (Home, SensorManagement, Calificaciones) y blueprints backend (sensores, medidas, dispositivos, votaciones).
- **Diagrama de casos de uso UML**: usar los casos de uso descritos arriba agrupados por actor (Agricultora, Administrador, Soporte técnico).

Estos esquemas sirven como documentación para el equipo de desarrollo, análisis y para presentaciones del proyecto.
