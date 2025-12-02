# Manual de Usuario - Plataforma SembrandoBits

Este manual explica cómo usar la plataforma web de SembrandoBits desde el punto de vista de una persona usuaria (sin entrar en detalles técnicos de programación).

---

## 1. Acceso inicial

1. Abra el navegador (Chrome, Edge o similar).
2. Ingrese la dirección de la aplicación (por ejemplo, `http://localhost:5173` o la URL que le hayan entregado).
3. Espere a que cargue la página principal llamada **“Panel de Información”**.

En la parte superior verá el logo y el título del proyecto *Sembrando Bits*.

---

## 2. Estructura general de la página

La página principal tiene estas secciones principales:

1. **Encabezado (Header)**: barra superior con el logo y el texto “Panel de Información”.
2. **Sección Hero / Portada**: imagen de fondo, nombre del proyecto y un botón **“Explorar sensores”**.
3. **Selección de Medio**: tarjetas para elegir **Terreno** o **Aire**.
4. **Sección de Terreno** (si elige Terreno):
   - Selección de dispositivo (1, 2 o 3).
   - Tarjetas con valores de sensores de suelo.
   - Selección de cultivo.
   - Análisis de compatibilidad del cultivo.
   - Recomendaciones generales.
5. **Sección de Aire** (si elige Aire):
   - Indicador de calidad del aire.
   - Tarjetas con valores de sensores de aire.
6. **Sección de Calificación**: para valorar si la información fue útil.
7. **Pie de página (Footer)**: información del proyecto y agradecimientos.

---

## 3. Uso de la sección Hero

En la portada verá un botón verde **“Explorar sensores”**.

- Haga clic en **“Explorar sensores”** para bajar automáticamente a la sección donde se selecciona el medio (**Terreno** o **Aire**).

---

## 4. Seleccionar el Medio: Terreno o Aire

En la sección **“Selecciona el Medio a explorar”** verá dos tarjetas:

1. **Terreno**
   - Muestra información de sensores del suelo: humedad, pH, nutrientes, etc.
   - Tiene un botón **“Haz click aquí”**.
2. **Aire**
   - Muestra información de sensores del entorno: temperatura ambiente, humedad relativa, gases, etc.
   - También tiene un botón **“Haz click aquí”**.

### Cómo usarlo

- Para ver información de suelo, haga clic en el botón de **Terreno**.
- Para ver información del aire, haga clic en el botón de **Aire**.
- Si vuelve a hacer clic en el mismo medio, se contrae/oculta la información.

---

## 5. Sección de Terreno

### 5.1 Selección de dispositivo

Al elegir **Terreno**, se abrirá una sección llamada:

> **“Selecciona el dispositivo que quieres revisar”**

Verá tres botones:
- **Dispositivo 1**
- **Dispositivo 2**
- **Dispositivo 3**

Cada dispositivo corresponde a un conjunto de sensores instalados en el campo.

#### Cómo usarlo

1. Haga clic en **Dispositivo 1**, **2** o **3**.
2. El botón seleccionado se resalta con un color más intenso.
3. Debajo aparecerán las tarjetas de sensores asociadas al dispositivo elegido.

Puede volver a hacer clic en el mismo dispositivo para des-seleccionarlo y ocultar las tarjetas.

### 5.2 Tarjetas de sensores de terreno

Debajo de los botones de dispositivos verá tarjetas con información. Cada tarjeta suele mostrar:

- Un **icono** (gota, hoja, termómetro, etc.).
- El **nombre del campo** (por ejemplo, Humedad del suelo).
- El **valor actual** (por ejemplo, `32.5%`, `pH 6.2`, `1.1 dS/m`).
- Una **descripción corta** de lo que significa ese sensor.

Mientras se cargan los datos pueden aparecer tarjetas de tipo “esqueleto” (bloques grises) indicando que los valores están en proceso de carga.

Si los datos se están actualizando, las tarjetas pueden verse ligeramente transparentes durante un instante.

### 5.3 Selección de cultivo

Más abajo, en la sección:

> **“Selecciona el cultivo que quieres revisar”**

Verá una cuadrícula de tarjetas con distintos cultivos (maíz, tomate, yuca, etc.). Cada tarjeta muestra:

- Una **imagen** del cultivo.
- El **nombre** del cultivo.
- Un botón **“Haz click aquí”**.

#### Cómo usarlo

1. Busque el cultivo que le interesa.
2. Haga clic en el botón **“Haz click aquí”** de esa tarjeta.
3. La página bajará automáticamente a la sección de **Análisis del cultivo**.

### 5.4 Análisis de compatibilidad del cultivo

La sección se titula:

> **“Análisis del cultivo: [Nombre del Cultivo]”**

Aquí verá:

1. **Tres círculos de estado** (verde, amarillo, rojo) con caritas/emojis, que representan:
   - Verde: condiciones **Compatibles**.
   - Amarillo: condiciones para **Revisar**.
   - Rojo: condiciones **No compatibles**.

   El círculo correspondiente se muestra más grande y resaltado según el resultado.

2. **Etiqueta principal de estado**:
   - Un recuadro grande que puede decir:
     - **Compatible** (verde)
     - **⚠️ Revisar condiciones** (amarillo)
     - **✕ No Compatible** (rojo)

3. **Texto de recomendación**:
   - Un párrafo que explica de forma sencilla qué tan adecuadas son las condiciones actuales para ese cultivo y qué tener en cuenta.

4. **Rangos recomendados**:
   - Tres tarjetas que indican los rangos ideales para ese cultivo:
     - **Rango de Humedad** del suelo.
     - **Rango de pH**.
     - **Rango de Nutrientes / Conductividad eléctrica**.

#### Cómo se calcula

La compatibilidad se calcula combinando las métricas reales de **todos los dispositivos** de terreno que estén enviando datos. Se hace un promedio y se compara con los rangos ideales de cada cultivo.

El sistema clasifica el resultado como:
- **Compatible**: la mayoría de parámetros están dentro del rango ideal.
- **Revisar**: algunos parámetros están fuera del rango y conviene ajustar riego, fertilización u otros manejos.
- **No compatible**: varios parámetros están claramente fuera del rango recomendado.

No es necesario que la persona usuaria haga ningún cálculo; solo debe fijarse en el estado y las recomendaciones.

### 5.5 Recomendaciones generales

Cuando **Terreno** está seleccionado, más abajo aparece la sección:

> **“Recomendaciones generales para mejorar tu cultivo”**

Aquí encontrará varias tarjetas con consejos prácticos, por ejemplo:

- Monitoreo constante.
- Rotación de cultivos.
- Riego eficiente.
- Fertilización natural.
- Control de plagas natural.
- Protección del suelo.

Cada tarjeta tiene un icono, un título y una explicación corta.

Al final hay un recuadro verde con un mensaje motivacional sobre la importancia de combinar conocimiento local y tecnología.

---

## 6. Sección de Aire

Si en la sección de medios eligió **Aire**, se mostrará la sección:

> **“Análisis de calidad del aire”**

### 6.1 Indicador de calidad del aire

Verá tres círculos:
- Verde: **Aire bueno**.
- Amarillo: **Aire moderado**.
- Rojo: **Aire malo**.

Uno de ellos aparecerá resaltado según los datos reales de los sensores.

Debajo verá un texto explicando la situación actual, por ejemplo:
- “Aire limpio, óptimo para tus cultivos.”
- “El aire es aceptable, revisa ventilación y humedad.”
- “Condiciones de aire no favorables, considera mejorar ventilación.”

### 6.2 Tarjetas de sensores de aire

Más abajo aparece el título **“Sensores del Aire”** y una cuadrícula de tarjetas, similares a las de terreno. Cada tarjeta puede mostrar:

- **Temperatura** del aire.
- **Humedad relativa**.
- **Concentración de gases** (por ejemplo CO₂ u otros contaminantes).

Cada tarjeta incluye:
- Un icono.
- Nombre del parámetro.
- Valor actual.
- Una explicación breve.

Si aún no hay lecturas, se indica que todavía no hay datos de sensores de aire.

---

## 7. Sección de Calificación

Al final de la página verá la sección:

> **“¿Consideras que esta información te fue de utilidad?”**

Aquí puede dejar una valoración de 1 a 5 estrellas.

### Cómo usarla

1. Haga clic sobre la cantidad de **estrellas** que quiera otorgar (1 = muy baja, 5 = muy alta).
2. Las estrellas seleccionadas se verán de color amarillo.
3. Haga clic en el botón **“Volver al inicio”**.

Al hacer clic en **“Volver al inicio”**:
- Si había seleccionado al menos 1 estrella, la calificación se envía al servidor.
- Se mostrará un pequeño mensaje de agradecimiento.
- La página hace scroll hacia la parte superior.

---

## 8. Pie de página

Al final de la página verá información institucional:

- Referencia a la convocatoria del Ministerio de Ciencia, Tecnología e Innovación de Colombia.
- Nombre del proyecto y código.
- Agradecimiento al Centro de Desarrollo Tecnológico Smart Regions Center.
- Derechos reservados.

No requiere interacción; es información de contexto y créditos del proyecto.

---

## 9. Buenas prácticas de uso

- Revise los sensores con regularidad para identificar cambios en el suelo y el aire.
- Use la sección de **compatibilidad de cultivos** como guía orientativa; complemente siempre con su experiencia y conocimiento local.
- Registre calificaciones honestas en la sección de estrellas para ayudar al equipo a mejorar la herramienta.
- Si nota que los datos no cambian durante mucho tiempo, consulte al equipo técnico por el estado de los sensores o la conexión a internet.

---

## 10. Soporte

Si encuentra errores en la plataforma (por ejemplo, mensajes de error, datos que no cargan, etc.):

1. Tome nota de la hora aproximada y lo que estaba haciendo.
2. Si es posible, haga una captura de pantalla.
3. Comparta esta información con el equipo técnico responsable del proyecto SembrandoBits para que puedan revisar los registros del sistema.

Con esto debería tener una guía completa para navegar y aprovechar todas las secciones de la página de SembrandoBits.
