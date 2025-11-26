# Módulo de Votaciones

Sistema de recopilación y almacenamiento de calificaciones de usuarios en la base de datos MongoDB.

## Descripción

El módulo `votaciones.py` gestiona el almacenamiento de las calificaciones (ratings) que los usuarios otorgan al sistema, permitiendo rastrear la satisfacción y utilidad de la información proporcionada.

## Colección en MongoDB

**Nombre:** `votaciones`

**Estructura del documento:**
```json
{
  "_id": ObjectId("..."),
  "rating": 1-5,
  "dispositivo": 1-3,
  "cultivo": "nombre_del_cultivo",
  "medio": "terreno" | "aire",
  "fecha": ISODate("2024-..."),
  "timestamp": "2024-..."
}
```

## Endpoints Disponibles

### 1. Guardar Votación
**POST** `/votacion`

Guarda una nueva calificación en la base de datos.

**Body (JSON):**
```json
{
  "rating": 5,
  "dispositivo": 1,
  "cultivo": "Tomate",
  "medio": "terreno"
}
```

**Campos:**
- `rating` (requerido): Número entre 1 y 5
- `dispositivo` (opcional): ID del dispositivo (1, 2 o 3)
- `cultivo` (opcional): Nombre del cultivo seleccionado
- `medio` (opcional): Tipo de medio ("terreno" o "aire")

**Respuesta exitosa (201):**
```json
{
  "mensaje": "Votación guardada exitosamente",
  "id": "507f1f77bcf86cd799439011",
  "votacion": {
    "rating": 5,
    "dispositivo": 1,
    "cultivo": "Tomate",
    "medio": "terreno",
    "timestamp": "2024-11-26T10:30:00.000Z"
  }
}
```

### 2. Obtener Votaciones
**GET** `/votaciones`

Recupera todas las votaciones o filtra por parámetros.

**Query Parameters (opcionales):**
- `rating`: Filtrar por calificación específica (1-5)
- `dispositivo`: Filtrar por dispositivo (1-3)
- `cultivo`: Filtrar por nombre de cultivo
- `medio`: Filtrar por medio ("terreno" o "aire")
- `limit`: Límite de resultados (default: 100)

**Ejemplos:**
```
GET /votaciones
GET /votaciones?rating=5
GET /votaciones?dispositivo=1&cultivo=Tomate
GET /votaciones?medio=terreno&limit=50
```

**Respuesta exitosa (200):**
```json
{
  "total": 15,
  "votaciones": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "rating": 5,
      "dispositivo": 1,
      "cultivo": "Tomate",
      "medio": "terreno",
      "fecha": "2024-11-26T10:30:00.000Z",
      "timestamp": "2024-11-26T10:30:00.000Z"
    }
  ]
}
```

### 3. Estadísticas de Votaciones
**GET** `/votaciones/estadisticas`

Obtiene estadísticas agregadas de todas las votaciones.

**Respuesta exitosa (200):**
```json
{
  "total_votaciones": 100,
  "promedio_rating": 4.23,
  "distribucion": {
    "1": 5,
    "2": 10,
    "3": 15,
    "4": 30,
    "5": 40
  }
}
```

### 4. Eliminar Votación
**DELETE** `/votaciones/<votacion_id>`

Elimina una votación específica por su ID.

**Ejemplo:**
```
DELETE /votaciones/507f1f77bcf86cd799439011
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Votación eliminada exitosamente"
}
```

## Integración con el Frontend

El frontend envía automáticamente la votación cuando el usuario:
1. Selecciona una calificación (1-5 estrellas)
2. Hace clic en el botón "Volver al inicio"

La votación incluye contexto adicional:
- El dispositivo que estaba visualizando
- El cultivo que tenía seleccionado (si aplica)
- El medio que estaba consultando (terreno/aire)

## Uso desde Python

```python
from votaciones import get_votaciones_collection

# Obtener todas las votaciones de 5 estrellas
votaciones_collection = get_votaciones_collection()
votaciones_5_estrellas = votaciones_collection.find({"rating": 5})

# Calcular promedio
from statistics import mean
ratings = [v["rating"] for v in votaciones_collection.find()]
promedio = mean(ratings) if ratings else 0
```

## Seguridad y Validación

- ✅ Validación de rango de rating (1-5)
- ✅ Validación de tipo de datos
- ✅ Manejo de errores con mensajes descriptivos
- ✅ Timestamps automáticos en UTC
- ✅ Índices automáticos para consultas eficientes

## Próximas Mejoras

- [ ] Agregar autenticación para asociar votaciones a usuarios
- [ ] Implementar rate limiting para evitar spam
- [ ] Agregar campo de comentarios opcionales
- [ ] Dashboard de visualización de estadísticas
- [ ] Exportación de datos en CSV/Excel
