# Manual de Usuario - Panel de Administración

Este manual está dirigido a personas administradoras de la plataforma SembrandoBits. Explica cómo usar principalmente la pestaña de **Calificaciones** dentro del panel de administración.

---

## 1. Acceso al panel de administración

1. Inicie sesión o acceda a la misma URL de la plataforma de SembrandoBits, pero agregando al final `/sensor-management`. Por ejemplo:
   - Página principal: `http://localhost:5173`
   - Panel administrador: `http://localhost:5173/sensor-management`
2. Una vez dentro del panel de administración, busque la sección o módulo llamado **Gestión de Sensores** o similar.
3. En ese módulo encontrará varias pestañas (por ejemplo: Lista de Sensores, Vincular Sensores, Últimas Medidas, Calificaciones, etc.).

---

## 2. Pestaña "Calificaciones"

La pestaña **Calificaciones** permite ver y administrar todas las valoraciones que las personas usuarias realizan desde la página principal (sección de estrellas “¿Consideras que esta información te fue de utilidad?”).

Al ingresar a esta pestaña, se cargarán automáticamente:

1. **Estadísticas generales de calificaciones.**
2. **Las últimas 50 calificaciones registradas.**

Si por algún motivo los datos no aparecen, puede usar el botón **Actualizar** (explicado más adelante).

---

## 3. Tarjetas de estadísticas

En la parte superior de la pestaña de Calificaciones verá tres tarjetas principales:

1. **Total Calificaciones**
   - Muestra el número total de votaciones registradas en el sistema.
   - Ayuda a dimensionar cuántas personas han interactuado con la plataforma.

2. **Promedio General**
   - Muestra el promedio de todas las calificaciones, en una escala de 1 a 5 estrellas.
   - Se acompaña de un icono de estrella.
   - Útil para evaluar la satisfacción general con la herramienta.

3. **Distribución de Calificaciones**
   - Muestra una barra por cada nivel de estrella (1★, 2★, 3★, 4★, 5★).
   - Cada barra indica:
     - La **cantidad** de calificaciones en ese nivel.
     - El **porcentaje** que representan frente al total.
   - Los colores ayudan a identificar rápidamente qué tan positivas o negativas son las valoraciones.

---

## 4. Tabla "Últimas 50 Calificaciones"

Debajo de las tarjetas de estadísticas encontrará una tabla titulada:

> **"Últimas 50 Calificaciones"**

La tabla contiene, para cada registro:

- **Fecha y Hora**: momento en que se registró la calificación.
- **Calificación**: se muestra en formato de estrellas (1 a 5).
- **Dispositivo**: número del dispositivo asociado (si la persona usuaria seleccionó uno en la página principal). Si no hay información, aparece un guion `-`.
- **Cultivo**: nombre del cultivo que estaba seleccionado cuando se hizo la calificación (si aplica). Puede aparecer `-` si no se seleccionó ningún cultivo.
- **Medio**: indica si la calificación proviene de una experiencia con el medio **terreno** o **aire**.
- **Nivel**: una etiqueta de color que resume la calificación:
  - **Excelente**: para calificaciones 4 o 5.
  - **Bueno**: para calificaciones 3.
  - **Regular**: para calificaciones 1 o 2.

Si no existen calificaciones registradas, en vez de la tabla se muestra un mensaje informando que aún no hay datos.

---

## 5. Botones de acción

En la esquina superior derecha de la tarjeta de "Últimas 50 Calificaciones" verá dos botones principales:

### 5.1 Botón "Actualizar"

- Icono: flecha circular (recarga).
- Función: volver a cargar tanto la lista de calificaciones como las estadísticas.
- Cuándo usarlo:
  - Después de un tiempo de uso, para ver nuevas calificaciones.
  - Después de borrar calificaciones, para confirmar que la información se actualizó correctamente.

Al hacer clic en **Actualizar**:
- El sistema consulta nuevamente el backend.
- La tabla y las estadísticas se refrescan con la información más reciente.

### 5.2 Botón "Borrar todo"

- Color: rojo (acción destructiva).
- Función: **eliminar todas las calificaciones** almacenadas en el sistema.
- El botón se deshabilita cuando ya no hay calificaciones para borrar.

Al hacer clic en **Borrar todo**:

1. Se muestra un mensaje de confirmación preguntando si realmente desea eliminar todas las calificaciones.
2. Si cancela, no se hace ningún cambio.
3. Si confirma:
   - El sistema envía una solicitud al backend para borrar todos los registros de votaciones.
   - Mientras se ejecuta el proceso, el botón puede mostrar un texto de "Borrando..." y deshabilitarse para evitar clics repetidos.
   - Al terminar, se muestran mensajes informativos:
     - **Éxito**: informa que las calificaciones fueron borradas correctamente.
     - **Error**: informa que no se pudieron borrar y sugiere intentarlo más tarde.
4. Después de una eliminación exitosa, es recomendable usar también el botón **Actualizar** para ver la tabla vacía y las estadísticas reiniciadas.

> **Advertencia:** Esta acción no se puede deshacer. Úsela solo cuando sea estrictamente necesario (por ejemplo, al iniciar una nueva fase de uso del sistema o al limpiar datos de prueba).

---

## 6. Interpretación de la información

Algunas recomendaciones para interpretar los datos desde el rol de administración:

- **Promedio alto (cercano a 5)**: indica que las personas usuarias están muy satisfechas con la información y la experiencia de la plataforma.
- **Promedio medio (alrededor de 3)**: sugiere que hay aspectos por mejorar (por ejemplo, claridad de los mensajes, velocidad de carga, calidad de los datos de sensores, etc.).
- **Promedio bajo (cercano a 1–2)**: es una alerta de que la experiencia no está siendo positiva; puede requerir revisar problemas técnicos o de contenido.
- **Distribución desequilibrada** (muchas 1★ y pocas 5★): indica insatisfacción general.
- **Distribución concentrada en 4★ y 5★**: muestra una aceptación alta de la herramienta.

---

## 7. Buenas prácticas para administradores

- Revise las calificaciones con frecuencia para detectar cambios en la percepción de las personas usuarias.
- Antes de borrar todas las calificaciones, considere si es necesario conservar el historial para análisis futuros.
- Si el promedio baja bruscamente en un período corto de tiempo, verifique si hubo cambios recientes en la plataforma (actualizaciones, fallos de sensores, problemas de conexión, etc.).
- Comparta los resultados agregados (por ejemplo, promedio de estrellas) con el equipo del proyecto para orientar decisiones de mejora.

---

## 8. Soporte y problemas frecuentes

Si desde la pestaña de Calificaciones observa algún problema, como por ejemplo:

- La tabla no carga o se queda vacía sin motivo aparente.
- El botón **Actualizar** no parece hacer efecto.
- El botón **Borrar todo** muestra mensajes de error repetidamente.

Siga estos pasos:

1. Verifique si la conexión a internet es estable.
2. Pida a otro usuario o equipo que intente acceder para comprobar si el problema es general.
3. Tome nota de la hora exacta y capture pantallas de los mensajes de error.
4. Envíe esta información al equipo técnico de SembrandoBits para que revisen los registros del backend.

Con este manual, las personas administradoras deberían poder usar de forma segura y efectiva la parte de calificaciones del panel de administración.
