# Parámetros para el cálculo de compatibilidad de cultivos

Esta tabla resume los valores que el sistema toma en cuenta desde los sensores para decidir si un cultivo es **compatible**, **revisar** o **no compatible** con las condiciones actuales.

| Parámetro                      | Claves que busca en los datos                        | Unidad         | Fuente (sensor)                  | Uso en el cálculo                                                                                          |
|--------------------------------|-------------------------------------------------------|----------------|----------------------------------|------------------------------------------------------------------------------------------------------------|
| Humedad del suelo             | `humedad`, `humidity`, `hum`, `soilhum`              | %              | Sensores de humedad de suelo     | Se compara contra el rango `humidityRange` del cultivo. Fuera de rango resta compatibilidad.              |
| pH del suelo                  | `ph`, `soilph`                                       | pH             | Sensor de pH de suelo            | Se compara contra el rango `phRange`. Valores fuera del rango ideal indican acidez o alcalinidad extrema. |
| Conductividad eléctrica (EC)  | `conductividad`, `ec`, `soilec`, `electric`          | dS/m           | Sensor de nutrientes/EC          | Se compara contra `nutrientsRange`. Representa concentración de sales/nutrientes en el suelo.             |
| Nitrógeno disponible (N)      | `nitrogeno`, `nitrogen`, `n`, `nitro`                | kg/ha (referencia) | Análisis de nutrientes suelo  | Si el cultivo define `nitrogenRange`, se verifica que el valor esté dentro de ese rango.                  |
| Fósforo disponible (P)        | `fosforo`, `phosphorus`, `p`, `fosf`                 | kg/ha (referencia) | Análisis de nutrientes suelo  | Si el cultivo define `phosphorusRange`, se comprueba que el valor esté entre los límites.                |
| Potasio disponible (K)        | `potasio`, `potassium`, `k`, `potas`                 | kg/ha (referencia) | Análisis de nutrientes suelo  | Si el cultivo define `potassiumRange`, se valida que el valor esté en el rango indicado.                 |
| Temperatura del suelo         | `temperatura_suelo`, `soiltemp`, `tempsuelo`, `temp_soil` | °C        | Sensor de temperatura de suelo   | Si el cultivo define `soilTempRange`, se compara esta temperatura con el rango ideal para raíces.        |
| Temperatura ambiente          | `temperatura_ambiente`, `temperatura`, `temp`, `airtemp`, `temperature` | °C | Sensor de ambiente o estación    | Si el cultivo define `airTempRange`, se usa para ver si el clima general está dentro de lo recomendado.   |

## Cómo se calcula la compatibilidad

1. Para cada cultivo se define un conjunto de rangos ideales en el objeto `cropCompatibility` de `Home.tsx`.
2. Para el dispositivo de suelo seleccionado (Dispositivo 1 o 2) se toman los valores numéricos reales de los sensores.
3. Por cada parámetro disponible (humedad, pH, EC, N, P, K, temperatura suelo, temperatura ambiente):
   - Si el valor está dentro del rango ideal, suma un "check" al conteo.
   - Si está fuera del rango, se registra un mensaje de alerta y no suma al conteo.
4. Al final se calcula un porcentaje de compatibilidad: `(checks_pasados / total_parametros_medidos) * 100`.
5. Según ese porcentaje:
   - ≥ 80%  → **Compatible**
   - 50–79% → **Revisar**
   - < 50%  → **No compatible**

Este documento te sirve como referencia para saber qué campos debes tener en tus sensores y con qué nombres para que el análisis funcione correctamente.

## Rangos exactos por cultivo

A continuación se listan los rangos exactos configurados en el sistema para cada cultivo. Todos estos valores salen directamente del objeto `cropCompatibility` en `Home.tsx`.

> Nota: Cuando un rango de N, P o K está vacío en la tabla es porque ese cultivo no usa actualmente ese parámetro en el cálculo (no está definido en `cropCompatibility`).

### Tabaco

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-80%          | %      |
| pH del suelo             | 5.8-6.5         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 80-150          | kg/ha  |
| Fósforo (P)              | 40-80           | kg/ha  |
| Potasio (K)              | 100-150         | kg/ha  |
| Temperatura del suelo    | 18-28           | °C     |
| Temperatura ambiente     | 20-30           | °C     |

### Millo

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 40-70%          | %      |
| pH del suelo             | 6.0-7.5         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 90-160          | kg/ha  |
| Fósforo (P)              | 40-80           | kg/ha  |
| Potasio (K)              | 60-120          | kg/ha  |
| Temperatura del suelo    | 18-30           | °C     |
| Temperatura ambiente     | 20-30           | °C     |

### Piña

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-75%          | %      |
| pH del suelo             | 4.5-5.5         | pH     |
| Conductividad eléctrica  | 0-1.0           | dS/m   |
| Nitrógeno (N)            | 230-300         | kg/ha  |
| Fósforo (P)              | 20-50           | kg/ha  |
| Potasio (K)              | 0.5-0.8         | kg/ha  |
| Temperatura del suelo    | 22-26           | °C     |
| Temperatura ambiente     | 20-30           | °C     |

### Maracuyá

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-80%          | %      |
| pH del suelo             | 5.5-6.5         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 153-153         | kg/ha  |
| Fósforo (P)              | 30-30           | kg/ha  |
| Potasio (K)              | 200-200         | kg/ha  |
| Temperatura del suelo    | 22-28           | °C     |
| Temperatura ambiente     | 20-30           | °C     |

### Melón

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-80%          | %      |
| pH del suelo             | 6.0-7.0         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 100-150         | kg/ha  |
| Fósforo (P)              | 30-60           | kg/ha  |
| Potasio (K)              | 150-200         | kg/ha  |
| Temperatura del suelo    | 22-30           | °C     |
| Temperatura ambiente     | 25-30           | °C     |

### Sandía

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-80%          | %      |
| pH del suelo             | 5.8-7.2         | pH     |
| Conductividad eléctrica  | 0-2.5           | dS/m   |
| Nitrógeno (N)            | 80-100          | kg/ha  |
| Fósforo (P)              | 25-60           | kg/ha  |
| Potasio (K)              | 35-80           | kg/ha  |
| Temperatura del suelo    | 20-30           | °C     |
| Temperatura ambiente     | 20-30           | °C     |

### Yuca

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 20-30%          | %      |
| pH del suelo             | 6.0-6.5         | pH     |
| Conductividad eléctrica  | 0-2.0           | dS/m   |
| Nitrógeno (N)            | 55-55           | kg/ha  |
| Fósforo (P)              | 26-26           | kg/ha  |
| Potasio (K)              | 105-105         | kg/ha  |
| Temperatura del suelo    | 30-30           | °C     |
| Temperatura ambiente     | 25-29           | °C     |

### Maíz

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 33-35%          | %      |
| pH del suelo             | 5.6-6.5         | pH     |
| Conductividad eléctrica  | 0-2.0           | dS/m   |
| Nitrógeno (N)            | 40-160          | kg/ha  |
| Fósforo (P)              | 20-80           | kg/ha  |
| Potasio (K)              | 20-80           | kg/ha  |
| Temperatura del suelo    | 20-25           | °C     |
| Temperatura ambiente     | 19-30           | °C     |

### Pimentón

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 20-30%          | %      |
| pH del suelo             | 6.5-7.0         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 390-920         | kg/ha  |
| Fósforo (P)              | 200-330         | kg/ha  |
| Potasio (K)              | 640-1530        | kg/ha  |
| Temperatura del suelo    | 18-23           | °C     |
| Temperatura ambiente     | 21-27           | °C     |

### Tomate

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-85%          | %      |
| pH del suelo             | 5.8-6.8         | pH     |
| Conductividad eléctrica  | 0-2.5           | dS/m   |
| Nitrógeno (N)            | 2.2-2.4         | kg/ha  |
| Fósforo (P)              | 40-60           | kg/ha  |
| Potasio (K)              | 2.6-3.6         | kg/ha  |
| Temperatura del suelo    | 16-20           | °C     |
| Temperatura ambiente     | 18-27           | °C     |

### Habichuela

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-80%          | %      |
| pH del suelo             | 5.8-7.2         | pH     |
| Conductividad eléctrica  | 1.2-2.5         | dS/m   |
| Nitrógeno (N)            | 40-80           | kg/ha  |
| Fósforo (P)              | 60-90           | kg/ha  |
| Potasio (K)              | 60-100          | kg/ha  |
| Temperatura del suelo    | 18-25           | °C     |
| Temperatura ambiente     | 18-28           | °C     |

### Fríjol

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 10-20%          | %      |
| pH del suelo             | 6.5-7.5         | pH     |
| Conductividad eléctrica  | 0-2.0           | dS/m   |
| Nitrógeno (N)            | 20-60           | kg/ha  |
| Fósforo (P)              | 40-60           | kg/ha  |
| Potasio (K)              | 30-40           | kg/ha  |
| Temperatura del suelo    | 18-26           | °C     |
| Temperatura ambiente     | 10-27           | °C     |

### Arveja

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 60-75%          | %      |
| pH del suelo             | 6.0-7.0         | pH     |
| Conductividad eléctrica  | 0-2.5           | dS/m   |
| Nitrógeno (N)            | 150-150         | kg/ha  |
| Fósforo (P)              | 20-20           | kg/ha  |
| Potasio (K)              | 70-70           | kg/ha  |
| Temperatura del suelo    | 15-23           | °C     |
| Temperatura ambiente     | 15-23           | °C     |

### Limón

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 85-90%          | %      |
| pH del suelo             | 6.0-7.5         | pH     |
| Conductividad eléctrica  | 0-2.0           | dS/m   |
| Nitrógeno (N)            | 200-200         | kg/ha  |
| Fósforo (P)              | 0.11-0.16       | kg/ha  |
| Potasio (K)              | 300-600         | kg/ha  |
| Temperatura del suelo    | 25-30           | °C     |
| Temperatura ambiente     | 18-38           | °C     |

### Mango

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 70-75%          | %      |
| pH del suelo             | 5.5-7.0         | pH     |
| Conductividad eléctrica  | 0-1.5           | dS/m   |
| Nitrógeno (N)            | 0-10            | kg/ha  |
| Fósforo (P)              | 60-80           | kg/ha  |
| Potasio (K)              | 0.25-0.40       | kg/ha  |
| Temperatura del suelo    | 27-27           | °C     |
| Temperatura ambiente     | 27-27           | °C     |

### Naranja

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 35-80%          | %      |
| pH del suelo             | 5.0-6.0         | pH     |
| Conductividad eléctrica  | 0.5-6.5         | dS/m   |
| Nitrógeno (N)            | 150-200         | kg/ha  |
| Fósforo (P)              | 25-50           | kg/ha  |
| Potasio (K)              | 150-200         | kg/ha  |
| Temperatura del suelo    | 22-27           | °C     |
| Temperatura ambiente     | 23-34           | °C     |

### Nopal

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 30-50%          | %      |
| pH del suelo             | 6.0-8.0         | pH     |
| Conductividad eléctrica  | 2.0-4.0         | dS/m   |
| Nitrógeno (N)            | 227-227         | kg/ha  |
| Fósforo (P)              | 122-122         | kg/ha  |
| Potasio (K)              | 300-300         | kg/ha  |
| Temperatura del suelo    | 20-30           | °C     |
| Temperatura ambiente     | 22-30           | °C     |

### Zanahoria

| Parámetro                | Rango           | Unidad |
|--------------------------|-----------------|--------|
| Humedad del suelo        | 70-80%          | %      |
| pH del suelo             | 5.8-7.0         | pH     |
| Conductividad eléctrica  | 0-2.0           | dS/m   |
| Nitrógeno (N)            | 120-120         | kg/ha  |
| Fósforo (P)              | 100-100         | kg/ha  |
| Potasio (K)              | 300-300         | kg/ha  |
| Temperatura del suelo    | 13-24           | °C     |
| Temperatura ambiente     | 15-21           | °C     |