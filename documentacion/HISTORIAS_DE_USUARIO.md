# Historias de Usuario - SembrandoBits

Este documento recoge las principales historias de usuario de la plataforma SembrandoBits, tanto para personas usuarias finales (agricultoras, técnicos de campo) como para personas administradoras.

---

## 1. Historias de usuario - Personas agricultoras / usuarias finales

### HU-01: Consultar el estado general del proyecto
**Como** agricultora interesada en el proyecto,
**quiero** ver una portada con el nombre y objetivo de SembrandoBits,
**para** entender rápidamente de qué trata la plataforma y sentir confianza al usarla.

### HU-02: Elegir el tipo de medio (Terreno o Aire)
**Como** usuaria que monitorea sus cultivos,
**quiero** seleccionar si deseo ver información del **Terreno** o del **Aire**,
**para** concentrarme solo en los datos que son relevantes para mi decisión en ese momento.

### HU-03: Ver datos de sensores de terreno por dispositivo
**Como** usuaria en campo,
**quiero** seleccionar un dispositivo de terreno (1, 2 o 3) y ver sus lecturas de sensores (humedad, pH, nutrientes, etc.),
**para** conocer el estado actual del suelo donde están mis cultivos.

### HU-04: Entender qué significa cada medición de sensor
**Como** usuaria sin conocimientos técnicos avanzados,
**quiero** que cada tarjeta de sensor incluya una breve descripción de lo que mide,
**para** comprender mejor cómo ese dato afecta a mis cultivos.

### HU-05: Ver datos actualizados sin refrescar manualmente
**Como** usuaria de la plataforma,
**quiero** que los valores de los sensores se actualicen cada cierto tiempo,
**para** estar segura de que la información que consulto es reciente y confiable.

### HU-06: Consultar compatibilidad de un cultivo con las condiciones actuales
**Como** agricultora que planea sembrar o cuidar un cultivo específico,
**quiero** elegir un cultivo de una lista y ver si las condiciones actuales del suelo son compatibles,
**para** tomar decisiones informadas sobre si sembrar, regar, fertilizar o hacer ajustes.

### HU-07: Recibir una recomendación clara sobre el cultivo
**Como** usuaria final,
**quiero** que, al seleccionar un cultivo, el sistema me muestre si las condiciones son **compatibles**, **para revisar** o **no compatibles**, junto con un texto de recomendación,
**para** saber qué acciones puedo tomar para mejorar o mantener mis cultivos.

### HU-08: Ver rangos ideales de humedad, pH y nutrientes
**Como** agricultora,
**quiero** ver los rangos recomendados de humedad, pH y nutrientes para el cultivo seleccionado,
**para** comparar rápidamente los valores ideales con los datos reales.

### HU-09: Ver recomendaciones generales de buenas prácticas agrícolas
**Como** usuaria interesada en mejorar mis prácticas agrícolas,
**quiero** leer recomendaciones generales (riego, rotación, fertilización, control de plagas, etc.),
**para** complementar la información de sensores con consejos prácticos.

### HU-10: Consultar la calidad del aire
**Como** agricultora que también se preocupa por el ambiente de sus cultivos,
**quiero** ver una sección de **calidad del aire** con un indicador (bueno, moderado, malo),
**para** saber si las condiciones del entorno son adecuadas para mis plantas.

### HU-11: Ver detalles de sensores de aire
**Como** usuaria,
**quiero** ver tarjetas con temperatura del aire, humedad relativa y concentración de gases,
**para** comprender mejor cómo el ambiente puede afectar la salud de mis cultivos.

### HU-12: Calificar la utilidad de la información
**Como** usuaria de la plataforma,
**quiero** poder dejar una calificación de 1 a 5 estrellas sobre la utilidad de la información mostrada,
**para** expresar mi satisfacción y ayudar al equipo a mejorar la herramienta.

---

## 2. Historias de usuario - Personas administradoras

### HU-ADM-01: Acceder al panel de administración
**Como** administradora del sistema,
**quiero** entrar al panel de administración usando la misma URL de la plataforma con el sufijo `/sensor-management`,
**para** gestionar sensores y calificaciones sin necesidad de otra aplicación.

### HU-ADM-02: Ver estadísticas generales de calificaciones
**Como** administradora,
**quiero** ver cuántas calificaciones se han registrado y el promedio general de estrellas,
**para** evaluar rápidamente el nivel de satisfacción de las personas usuarias.

### HU-ADM-03: Ver la distribución de calificaciones por estrella
**Como** administradora,
**quiero** ver cuántas calificaciones hay de 1, 2, 3, 4 y 5 estrellas,
**para** entender mejor si las opiniones están polarizadas o concentradas en cierto nivel.

### HU-ADM-04: Revisar el detalle de las últimas calificaciones
**Como** administradora,
**quiero** ver en una tabla las últimas 50 calificaciones con fecha, dispositivo, cultivo y medio,
**para** analizar en qué contextos se valora mejor o peor la plataforma.

### HU-ADM-05: Actualizar manualmente la vista de calificaciones
**Como** administradora,
**quiero** tener un botón de **Actualizar** que recargue las calificaciones y estadísticas,
**para** asegurarme de estar viendo la información más reciente cuando estoy revisando el panel.

### HU-ADM-06: Borrar todas las calificaciones
**Como** administradora responsable de los datos,
**quiero** poder borrar todas las calificaciones con un solo botón (previa confirmación),
**para** limpiar datos de prueba o iniciar una nueva fase de evaluación.

### HU-ADM-07: Prevenir errores al borrar calificaciones
**Como** administradora,
**quiero** que al borrar todas las calificaciones el sistema me pida confirmación y muestre mensajes claros de éxito o error,
**para** evitar eliminaciones accidentales y saber si la operación se completó correctamente.

### HU-ADM-08: Interpretar resultados para la mejora continua
**Como** administradora o coordinadora del proyecto,
**quiero** usar las estadísticas de calificaciones para identificar si la satisfacción mejora o empeora con el tiempo,
**para** tomar decisiones sobre mejoras técnicas o de contenido en la plataforma.

---

## 3. Historias de usuario - Personas técnicas / soporte

### HU-SOP-01: Verificar rápidamente si el backend está respondiendo
**Como** persona de soporte técnico,
**quiero** contar con un endpoint de prueba (`/test-db` o raíz del servidor),
**para** comprobar rápidamente si el servidor y la base de datos están disponibles.

### HU-SOP-02: Detectar problemas de sensado o conectividad
**Como** técnica de campo,
**quiero** revisar si los datos de sensores se actualizan con la frecuencia esperada,
**para** saber si hay fallos en la red, en los dispositivos o en la plataforma.

### HU-SOP-03: Usar las calificaciones como indicador de incidentes
**Como** persona de soporte,
**quiero** poder observar si el promedio de calificaciones baja de forma repentina,
**para** investigar posibles fallos recientes en la plataforma o en los sensores.

---

Estas historias de usuario sirven como base para validar que la plataforma SembrandoBits cumple con las necesidades de sus distintos tipos de usuarios y para guiar futuras mejoras.
