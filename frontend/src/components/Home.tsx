import React, { useState, useEffect } from 'react';
import { Sprout, Wheat, Droplet, Heart, Cloud, Leaf, Check, Star, Thermometer, Zap, FlaskConical, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import compatible from '/images/emojis/compatible.png';
import noCompatible from '/images/emojis/no-compatible.png';
import neutral from '/images/emojis/neutral.png';

const crops = [
  {
    id: 'tabaco',
    name: 'Tabaco',
    image: '/images/cultivos/Tabaco.jpg'
  },
  {
    id: 'millo',
    name: 'Millo',
    image: '/images/cultivos/Millo.jpg'
  },
  {
    id: 'pina',
    name: 'Piña',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'maracuya',
    name: 'Maracuyá',
    image: '/images/cultivos/Maracuya.jpg'
  },
  {
    id: 'melon',
    name: 'Melón',
    image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'sandia',
    name: 'Sandía',
    image: '/images/cultivos/Sandia.jpg'
  },
  {
    id: 'yuca',
    name: 'Yuca',
    image: '/images/cultivos/Yuca.jpg'
  },
  {
    id: 'maiz',
    name: 'Maíz',
    image: 'https://images.unsplash.com/photo-1608995855173-bb65a3fe1bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'pimenton',
    name: 'Pimentón',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'tomate',
    name: 'Tomate',
    image: '/images/cultivos/Tomate.jpg'
  },
  {
    id: 'habichuela',
    name: 'Habichuela',
    image: '/images/cultivos/Habichuelas.jpg'
  },
  {
    id: 'frijol',
    name: 'Fríjol',
    image: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'arveja',
    name: 'Arveja',
    image: '/images/cultivos/Arvejas.jpg'
  },
  {
    id: 'limon',
    name: 'Limón',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'mango',
    name: 'Mango',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'naranja',
    name: 'Naranja',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  },
  {
    id: 'nopal',
    name: 'Nopal',
    image: '/images/cultivos/Nopal.jpg'
  },
  {
    id: 'zanahoria',
    name: 'Zanahoria',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
  }
];

export default function Home() {
  const [selectedMedio, setSelectedMedio] = useState<'terreno' | 'aire' | null>(null);
  const [selectedDispositivo, setSelectedDispositivo] = useState<1 | 2 | 3 | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [airQualityStatus, setAirQualityStatus] = useState<'bueno' | 'moderado' | 'malo'>('bueno');
  const [sensorData, setSensorData] = useState<Record<1 | 2 | 3, any>>({} as Record<1 | 2 | 3, any>);
  const [lastSensorData, setLastSensorData] = useState<Record<1 | 2 | 3, any>>({} as Record<1 | 2 | 3, any>);
  const [loading, setLoading] = useState(false);
  const [dataAge, setDataAge] = useState<Record<1 | 2 | 3, Date | null>>({ 1: null, 2: null, 3: null });

  const API_BASE_URL = "http://127.0.0.1:8860";

  // Función para obtener datos del dispositivo
  const fetchDeviceData = (deviceId: 1 | 2 | 3) => {
    fetch(`${API_BASE_URL}/dispositivo/${deviceId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.datos) {
          setSensorData(prev => ({ ...prev, [deviceId]: data.datos }));
          setLastSensorData(prev => ({ ...prev, [deviceId]: data.datos }));
          setDataAge(prev => ({ ...prev, [deviceId]: new Date() }));
        }
      })
      .catch(err => {
        console.error(`Error fetching data for device ${deviceId}:`, err);
        // Si hay error pero tenemos datos previos, los conservamos
        if (lastSensorData[deviceId]) {
          setSensorData(prev => ({ ...prev, [deviceId]: lastSensorData[deviceId] }));
        }
      });
  };

  // Cargar datos de TODOS los dispositivos al inicio para análisis de cultivos
  useEffect(() => {
    // Cargar datos iniciales de todos los dispositivos
    [1, 2, 3].forEach(id => fetchDeviceData(id as 1 | 2 | 3));
    
    // Configurar polling cada 30 segundos para todos los dispositivos
    const intervalId = setInterval(() => {
      [1, 2, 3].forEach(id => fetchDeviceData(id as 1 | 2 | 3));
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch real sensor data when device is selected (polling más frecuente para el seleccionado)
  useEffect(() => {
    if (selectedDispositivo) {
      setLoading(true);
      fetchDeviceData(selectedDispositivo);
      setLoading(false);
      
      // Configurar polling cada 10 segundos para actualización automática del dispositivo seleccionado
      const intervalId = setInterval(() => {
        fetchDeviceData(selectedDispositivo);
      }, 10000);
      
      // Limpiar el intervalo cuando cambie el dispositivo o se desmonte el componente
      return () => clearInterval(intervalId);
    }
  }, [selectedDispositivo]);

  const scrollToTop = async () => {
    // Si hay un rating, enviarlo al backend antes de volver al inicio
    if (rating > 0) {
      try {
        const votacionData = {
          rating: rating,
          dispositivo: selectedDispositivo,
          cultivo: selectedCrop,
          medio: selectedMedio
        };

        const response = await fetch(`${API_BASE_URL}/votacion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(votacionData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al enviar la votación');
        }

        const result = await response.json();
        console.log('Votación enviada exitosamente:', result);
        toast.success('¡Gracias por tu calificación!', {
          description: `Has calificado con ${rating} estrella${rating > 1 ? 's' : ''}`
        });
      } catch (error) {
        console.error('Error al enviar la votación:', error);
        toast.error('Error al guardar tu calificación', {
          description: 'Por favor intenta nuevamente'
        });
      }
    }

    // Resetear el rating después de enviarlo
    setRating(0);
    
    // Volver al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMedioSelection = (medio: 'terreno' | 'aire') => {
    // Si ya está seleccionado el mismo medio, retraer (deseleccionar)
    if (selectedMedio === medio) {
      setSelectedMedio(null);
      setSelectedDispositivo(null);
      setSelectedCrop(null);
    } else {
      // Si no está seleccionado o es diferente, desplegar
      setSelectedMedio(medio);
      setSelectedDispositivo(null);
      setSelectedCrop(null);
      
      if (medio === 'aire') {
        setTimeout(() => {
          document.getElementById('aire-analisis')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setTimeout(() => {
          document.getElementById('dispositivo')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleCropSelection = (cropId: string) => {
    setSelectedCrop(cropId);
    setTimeout(() => {
      document.getElementById('crop-analysis')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Función para buscar un valor en los datos del sensor por patrones de nombre
  const findFieldValue = (data: any, patterns: string[]): number | null => {
    for (const pattern of patterns) {
      const keys = Object.keys(data);
      const matchingKey = keys.find(key => {
        const keyLower = key.toLowerCase();
        return keyLower === pattern || keyLower.includes(pattern);
      });
      if (matchingKey && data[matchingKey] !== undefined && data[matchingKey] !== null) {
        return typeof data[matchingKey] === 'number' ? data[matchingKey] : parseFloat(data[matchingKey]);
      }
    }
    return null;
  };

  // Función para calcular la compatibilidad del cultivo basada en datos reales
  const calculateCropCompatibility = (cropId: string) => {
    // Usar datos del dispositivo seleccionado, o si no hay uno, usar todos los disponibles
    let dataToUse = null;
    
    if (selectedDispositivo && sensorData[selectedDispositivo]) {
      dataToUse = sensorData[selectedDispositivo];
    } else {
      // Si no hay dispositivo seleccionado, usar datos de cualquier dispositivo disponible
      // Prioridad: 1 > 2 > 3
      for (const deviceId of [1, 2, 3] as const) {
        if (sensorData[deviceId] && Object.keys(sensorData[deviceId]).length > 0) {
          dataToUse = sensorData[deviceId];
          break;
        }
      }
    }
    
    if (!dataToUse) {
      return cropCompatibility[cropId];
    }

    const realData = dataToUse;
    const crop = cropCompatibility[cropId];
    let compatible = true;
    let issues: string[] = [];
    let totalChecks = 0;
    let passedChecks = 0;

    // Extract numeric values from ranges
    const parseRange = (range: string) => {
      const matches = range.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
      if (matches) {
        return { min: parseFloat(matches[1]), max: parseFloat(matches[2]) };
      }
      return null;
    };

    // Check humidity - buscar por patrones
    const humidity = findFieldValue(realData, ['humedad', 'humidity', 'hum', 'soilhum']);
    if (humidity !== null) {
      totalChecks++;
      const humidityRange = parseRange(crop.humidityRange);
      if (humidityRange && (humidity < humidityRange.min || humidity > humidityRange.max)) {
        compatible = false;
        issues.push(`Humedad fuera de rango (actual: ${humidity}%, ideal: ${crop.humidityRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check pH
    const ph = findFieldValue(realData, ['ph', 'soilph']);
    if (ph !== null) {
      totalChecks++;
      const phRange = parseRange(crop.phRange);
      if (phRange && (ph < phRange.min || ph > phRange.max)) {
        compatible = false;
        issues.push(`pH fuera de rango (actual: ${ph}, ideal: ${crop.phRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check nutrients (EC/Conductividad)
    const ec = findFieldValue(realData, ['conductividad', 'ec', 'soilec', 'electric']);
    if (ec !== null) {
      totalChecks++;
      const nutrientsRange = parseRange(crop.nutrientsRange);
      if (nutrientsRange && (ec < nutrientsRange.min || ec > nutrientsRange.max)) {
        compatible = false;
        issues.push(`Conductividad eléctrica fuera de rango (actual: ${ec} dS/m, ideal: ${crop.nutrientsRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check Nitrogen (N)
    const nitrogen = findFieldValue(realData, ['nitrogeno', 'nitrogen', 'n', 'nitro']);
    if (nitrogen !== null && crop.nitrogenRange) {
      totalChecks++;
      const nitrogenRange = parseRange(crop.nitrogenRange);
      if (nitrogenRange && (nitrogen < nitrogenRange.min || nitrogen > nitrogenRange.max)) {
        compatible = false;
        issues.push(`Nitrógeno fuera de rango (actual: ${nitrogen} kg/ha, ideal: ${crop.nitrogenRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check Phosphorus (P)
    const phosphorus = findFieldValue(realData, ['fosforo', 'phosphorus', 'p', 'fosf']);
    if (phosphorus !== null && crop.phosphorusRange) {
      totalChecks++;
      const phosphorusRange = parseRange(crop.phosphorusRange);
      if (phosphorusRange && (phosphorus < phosphorusRange.min || phosphorus > phosphorusRange.max)) {
        compatible = false;
        issues.push(`Fósforo fuera de rango (actual: ${phosphorus} kg/ha, ideal: ${crop.phosphorusRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check Potassium (K)
    const potassium = findFieldValue(realData, ['potasio', 'potassium', 'k', 'potas']);
    if (potassium !== null && crop.potassiumRange) {
      totalChecks++;
      const potassiumRange = parseRange(crop.potassiumRange);
      if (potassiumRange && (potassium < potassiumRange.min || potassium > potassiumRange.max)) {
        compatible = false;
        issues.push(`Potasio fuera de rango (actual: ${potassium} kg/ha, ideal: ${crop.potassiumRange})`);
      } else {
        passedChecks++;
      }
    }

    // Check Soil Temperature
    const soilTemp = findFieldValue(realData, ['temperatura_suelo', 'soiltemp', 'tempsuelo', 'temp_soil']);
    if (soilTemp !== null && crop.soilTempRange) {
      totalChecks++;
      const soilTempRange = parseRange(crop.soilTempRange);
      if (soilTempRange && (soilTemp < soilTempRange.min || soilTemp > soilTempRange.max)) {
        compatible = false;
        issues.push(`Temperatura del suelo fuera de rango (actual: ${soilTemp}°C, ideal: ${crop.soilTempRange}°C)`);
      } else {
        passedChecks++;
      }
    }

    // Check Air Temperature
    const airTemp = findFieldValue(realData, ['temperatura_ambiente', 'temperatura', 'temp', 'airtemp', 'temperature']);
    if (airTemp !== null && crop.airTempRange) {
      totalChecks++;
      const airTempRange = parseRange(crop.airTempRange);
      if (airTempRange && (airTemp < airTempRange.min || airTemp > airTempRange.max)) {
        compatible = false;
        issues.push(`Temperatura ambiente fuera de rango (actual: ${airTemp}°C, ideal: ${crop.airTempRange}°C)`);
      } else {
        passedChecks++;
      }
    }

    // Calcular el porcentaje de compatibilidad
    const compatibilityPercentage = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    // Determinar el estado basado en el porcentaje
    let finalStatus: 'compatible' | 'revisar' | 'no-compatible' = 'compatible';
    if (compatibilityPercentage < 50) {
      finalStatus = 'no-compatible';
    } else if (compatibilityPercentage < 80) {
      finalStatus = 'revisar';
    }

    return {
      ...crop,
      compatible: compatibilityPercentage >= 80,
      status: finalStatus,
      recommendation: compatible 
        ? `${crop.recommendation} Compatibilidad: ${compatibilityPercentage}% (${passedChecks}/${totalChecks} parámetros dentro de rango)`
        : `Compatibilidad: ${compatibilityPercentage}%. ${issues.join('. ')}`
    };
  };

  // Obtener los campos dinámicamente desde el endpoint /listar_sensores_campos
  const [camposSensor, setCamposSensor] = useState<Record<1 | 2 | 3, string[]>>({
    1: [],
    2: [],
    3: []
  });

  // Fetch field names for each sensor
  useEffect(() => {
    fetch(`${API_BASE_URL}/listar_sensores_campos`)
      .then(res => res.json())
      .then(data => {
        const newCampos: Record<1 | 2 | 3, string[]> = { 1: [], 2: [], 3: [] };
        
        data.forEach((sensor: any) => {
          // Map sensor names to device numbers
          if (sensor.sensor === 'SB_It001' || sensor.sensor === 'sensor1') {
            newCampos[1] = sensor.campos.map((c: any) => c.nombre_campo);
          } else if (sensor.sensor === 'SB_CA001' || sensor.sensor === 'sensor2') {
            newCampos[2] = sensor.campos.map((c: any) => c.nombre_campo);
          } else if (sensor.sensor === 'sensor3') {
            newCampos[3] = sensor.campos.map((c: any) => c.nombre_campo);
          }
        });
        
        setCamposSensor(newCampos);
      })
      .catch(err => console.error('Error fetching sensor fields:', err));
  }, []);

  // Función para obtener icono basado en el nombre del campo
  const getIconForField = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('humedad') || name.includes('humidity') || name.includes('hum')) {
      return <Droplet className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('ph')) {
      return <Leaf className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('temp') || name.includes('temperatura')) {
      return <Thermometer className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('conductividad') || name.includes('ec') || name.includes('electric')) {
      return <Zap className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('nitro') || name.includes('nitrogen') || name === 'n') {
      return <FlaskConical className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('fosf') || name.includes('phosph') || name === 'p') {
      return <Sprout className="w-10 h-10 text-[#7cb342]" />;
    } else if (name.includes('potas') || name.includes('potass') || name === 'k') {
      return <Wheat className="w-10 h-10 text-[#7cb342]" />;
    }
    return <Activity className="w-10 h-10 text-[#7cb342]" />;
  };

  // Función para obtener descripción basada en el nombre del campo
  const getDescriptionForField = (fieldName: string) => {
    const name = fieldName.toLowerCase();
    if (name.includes('humedad') || name.includes('humidity')) {
      return 'Cantidad de agua en el suelo';
    } else if (name.includes('ph')) {
      return 'Nivel de acidez o alcalinidad del suelo';
    } else if (name.includes('temp')) {
      return 'Temperatura del suelo';
    } else if (name.includes('conductividad') || name.includes('ec')) {
      return 'Indica la cantidad de nutrientes en el suelo';
    } else if (name.includes('nitro') || name === 'n') {
      return 'Nutriente esencial para el crecimiento de las hojas';
    } else if (name.includes('fosf') || name === 'p') {
      return 'Nutriente importante para las raíces';
    } else if (name.includes('potas') || name === 'k') {
      return 'Nutriente que fortalece la planta';
    }
    return 'Medición del sensor';
  };

  // Datos completos de sensores por dispositivo (estructura dinámica)
  const dispositivoSensores: Record<1 | 2 | 3, {
    nombre: string;
    sensores: Array<{
      nombre: string;
      valor: string;
      descripcion: string;
      icon: React.ReactNode;
    }>;
  }> = {
    1: {
      nombre: 'Dispositivo 1 (SB_It001)',
      sensores: camposSensor[1].length > 0 
        ? camposSensor[1].map(campo => {
            const realData = sensorData[1];
            let displayValue = 'Cargando...';
            
            // Si hay datos reales, formatear el valor
            if (realData && realData[campo] !== undefined && realData[campo] !== null) {
              const value = realData[campo];
              const name = campo.toLowerCase();
              
              if (name.includes('humedad') || name.includes('humidity') || name.includes('hum')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}%`;
              } else if (name.includes('ph')) {
                displayValue = typeof value === 'number' ? value.toFixed(1) : value.toString();
              } else if (name.includes('temp') || name.includes('temperatura')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}°C`;
              } else if (name.includes('conductividad') || name.includes('ec') || name.includes('electric')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value} dS/m`;
              } else if (name.includes('nitro') || name.includes('fosf') || name.includes('potas') || name === 'n' || name === 'p' || name === 'k') {
                displayValue = `${typeof value === 'number' ? value.toFixed(0) : value} ppm`;
              } else {
                displayValue = typeof value === 'number' ? value.toFixed(2) : value.toString();
              }
            }
            
            return {
              nombre: campo,
              valor: displayValue,
              descripcion: getDescriptionForField(campo),
              icon: getIconForField(campo)
            };
          })
        : [
            {
              nombre: 'Cargando...',
              valor: '...',
              descripcion: 'Obteniendo información de sensores',
              icon: <Activity className="w-10 h-10 text-[#7cb342]" />
            }
          ]
    },
    2: {
      nombre: 'Dispositivo 2 (SB_CA001)',
      sensores: camposSensor[2].length > 0 
        ? camposSensor[2].map(campo => {
            const realData = sensorData[2];
            let displayValue = 'Cargando...';
            
            // Si hay datos reales, formatear el valor
            if (realData && realData[campo] !== undefined && realData[campo] !== null) {
              const value = realData[campo];
              const name = campo.toLowerCase();
              
              if (name.includes('humedad') || name.includes('humidity') || name.includes('hum')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}%`;
              } else if (name.includes('ph')) {
                displayValue = typeof value === 'number' ? value.toFixed(1) : value.toString();
              } else if (name.includes('temp') || name.includes('temperatura')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}°C`;
              } else if (name.includes('conductividad') || name.includes('ec') || name.includes('electric')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value} dS/m`;
              } else if (name.includes('nitro') || name.includes('fosf') || name.includes('potas') || name === 'n' || name === 'p' || name === 'k') {
                displayValue = `${typeof value === 'number' ? value.toFixed(0) : value} ppm`;
              } else {
                displayValue = typeof value === 'number' ? value.toFixed(2) : value.toString();
              }
            }
            
            return {
              nombre: campo,
              valor: displayValue,
              descripcion: getDescriptionForField(campo),
              icon: getIconForField(campo)
            };
          })
        : [
            {
              nombre: 'Cargando...',
              valor: '...',
              descripcion: 'Obteniendo información de sensores',
              icon: <Activity className="w-10 h-10 text-[#7cb342]" />
            }
          ]
    },
    3: {
      nombre: 'Dispositivo 3',
      sensores: camposSensor[3].length > 0 
        ? camposSensor[3].map(campo => {
            const realData = sensorData[3];
            let displayValue = 'Cargando...';
            
            // Si hay datos reales, formatear el valor
            if (realData && realData[campo] !== undefined && realData[campo] !== null) {
              const value = realData[campo];
              const name = campo.toLowerCase();
              
              if (name.includes('humedad') || name.includes('humidity') || name.includes('hum')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}%`;
              } else if (name.includes('ph')) {
                displayValue = typeof value === 'number' ? value.toFixed(1) : value.toString();
              } else if (name.includes('temp') || name.includes('temperatura')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value}°C`;
              } else if (name.includes('conductividad') || name.includes('ec') || name.includes('electric')) {
                displayValue = `${typeof value === 'number' ? value.toFixed(1) : value} dS/m`;
              } else if (name.includes('nitro') || name.includes('fosf') || name.includes('potas') || name === 'n' || name === 'p' || name === 'k') {
                displayValue = `${typeof value === 'number' ? value.toFixed(0) : value} ppm`;
              } else {
                displayValue = typeof value === 'number' ? value.toFixed(2) : value.toString();
              }
            }
            
            return {
              nombre: campo,
              valor: displayValue,
              descripcion: getDescriptionForField(campo),
              icon: getIconForField(campo)
            };
          })
        : [
            {
              nombre: 'Cargando...',
              valor: '...',
              descripcion: 'Obteniendo información de sensores',
              icon: <Activity className="w-10 h-10 text-[#7cb342]" />
            }
          ]
    }
  };

  // Datos de compatibilidad de cultivos
  // Estructura completa de requisitos agronómicos por cultivo (basado en PDF)
  const cropCompatibility: Record<string, {
    name: string;
    compatible: boolean;
    status: 'compatible' | 'revisar' | 'no-compatible';
    // Rangos principales (mostrados en UI)
    humidityRange: string;
    phRange: string;
    nutrientsRange: string;
    recommendation: string;
    // Rangos completos de nutrientes (usados en cálculo interno)
    potassiumRange?: string; // Potasio (K) en kg/ha
    phosphorusRange?: string; // Fósforo (P) en kg/ha
    nitrogenRange?: string; // Nitrógeno (N) en kg/ha
    soilTempRange?: string; // Temperatura del suelo en °C
    airTempRange?: string; // Temperatura ambiente en °C
  }> = {
    tabaco: {
      name: 'Tabaco',
      compatible: false,
      status: 'revisar',
      humidityRange: '60-80%',
      phRange: '5.8-6.5',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '100-150',
      phosphorusRange: '40-80',
      nitrogenRange: '80-150',
      soilTempRange: '18-28',
      airTempRange: '20-30',
      recommendation: 'Requiere humedad de suelo al 60-80% de capacidad de campo y pH entre 5.8-6.5. Conductividad eléctrica ideal menor a 1.5 dS/m. Temperatura óptima 20-30°C.'
    },
    millo: {
      name: 'Millo',
      compatible: true,
      status: 'compatible',
      humidityRange: '40-70%',
      phRange: '6.0-7.5',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '60-120',
      phosphorusRange: '40-80',
      nitrogenRange: '90-160',
      soilTempRange: '18-30',
      airTempRange: '20-30',
      recommendation: 'Necesita entre 500-2000 mm de lluvia anual. pH ideal de 6.0-7.5. Conductividad eléctrica menor de 1.5 dS/m es ideal. Temperatura óptima 20-30°C.'
    },
    pina: {
      name: 'Piña',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-75%',
      phRange: '4.5-5.5',
      nutrientsRange: '0-1.0 dS/m',
      potassiumRange: '0.5-0.8',
      phosphorusRange: '20-50',
      nitrogenRange: '230-300',
      soilTempRange: '22-26',
      airTempRange: '20-30',
      recommendation: 'Prefiere pH ácido entre 4.5-5.5. Conductividad eléctrica debe estar por debajo de 1 dS/m. Humedad relativa ideal 85-95%. Temperatura óptima 20-30°C.'
    },
    maracuya: {
      name: 'Maracuyá',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-80%',
      phRange: '5.5-6.5',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '200-200',
      phosphorusRange: '30-30',
      nitrogenRange: '153-153',
      soilTempRange: '22-28',
      airTempRange: '20-30',
      recommendation: 'Requiere 500-700 mm de lluvia anual. Humedad del suelo al 60-80% de capacidad. pH óptimo 5.5-6.5. CE ideal menor a 1.5 dS/m. Temperatura óptima 20-30°C.'
    },
    melon: {
      name: 'Melón',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-80%',
      phRange: '6.0-7.0',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '150-200',
      phosphorusRange: '30-60',
      nitrogenRange: '100-150',
      soilTempRange: '22-30',
      airTempRange: '25-30',
      recommendation: 'Requiere 500-700 mm anuales. Humedad del suelo al 60-80% de capacidad. pH óptimo 6.0-7.0. CE ideal menor a 1.5 dS/m. Temperatura óptima 25-30°C.'
    },
    sandia: {
      name: 'Sandía',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-80%',
      phRange: '5.8-7.2',
      nutrientsRange: '0-2.5 dS/m',
      potassiumRange: '35-80',
      phosphorusRange: '25-60',
      nitrogenRange: '80-100',
      soilTempRange: '20-30',
      airTempRange: '20-30',
      recommendation: 'Humedad del suelo al 60-80%. pH ideal entre 5.8-7.2. Conductividad eléctrica hasta 2.5 dS/m es tolerable. Temperatura óptima 20-30°C.'
    },
    yuca: {
      name: 'Yuca',
      compatible: true,
      status: 'compatible',
      humidityRange: '20-30%',
      phRange: '6.0-6.5',
      nutrientsRange: '0-2.0 dS/m',
      potassiumRange: '105-105',
      phosphorusRange: '26-26',
      nitrogenRange: '55-55',
      soilTempRange: '30-30',
      airTempRange: '25-29',
      recommendation: 'Humedad ideal del suelo al 25%. pH óptimo entre 6.0-6.5. CE menor a 2 dS/m, evitar incrementos hacia 4 dS/m. Temperatura óptima 25-29°C.'
    },
    maiz: {
      name: 'Maíz',
      compatible: true,
      status: 'compatible',
      humidityRange: '33-35%',
      phRange: '5.6-6.5',
      nutrientsRange: '0-2.0 dS/m',
      potassiumRange: '20-80',
      phosphorusRange: '20-80',
      nitrogenRange: '40-160',
      soilTempRange: '20-25',
      airTempRange: '19-30',
      recommendation: 'Requiere humedad del suelo al 33-35%. pH ideal entre 5.6-6.5. CE entre 0-2 mmhos/cm para mejor desarrollo. Temperatura óptima 19-30°C.'
    },
    pimenton: {
      name: 'Pimentón',
      compatible: true,
      status: 'compatible',
      humidityRange: '20-30%',
      phRange: '6.5-7.0',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '640-1530',
      phosphorusRange: '200-330',
      nitrogenRange: '390-920',
      soilTempRange: '18-23',
      airTempRange: '21-27',
      recommendation: 'Humedad del suelo alrededor del 25%. pH óptimo entre 6.5-7.0. Conductividad eléctrica máxima 1.5 dS/m. Temperatura óptima 21-27°C.'
    },
    tomate: {
      name: 'Tomate',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-85%',
      phRange: '5.8-6.8',
      nutrientsRange: '0-2.5 dS/m',
      potassiumRange: '2.6-3.6',
      phosphorusRange: '40-60',
      nitrogenRange: '2.2-2.4',
      soilTempRange: '16-20',
      airTempRange: '18-27',
      recommendation: 'Humedad relativa óptima entre 60-85%. pH del suelo entre 5.8-6.8. Tolera CE hasta 2.5 mS/cm sin reducción de producción. Temperatura óptima 18-27°C.'
    },
    habichuela: {
      name: 'Habichuela',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-80%',
      phRange: '5.8-7.2',
      nutrientsRange: '1.2-2.5 dS/m',
      potassiumRange: '60-100',
      phosphorusRange: '60-90',
      nitrogenRange: '40-80',
      soilTempRange: '18-25',
      airTempRange: '18-28',
      recommendation: 'Humedad del suelo al 60-80%. pH ideal entre 5.8-7.2. CE entre 1.2-2.5 dS/m es adecuado para buen desarrollo. Temperatura óptima 18-28°C.'
    },
    frijol: {
      name: 'Fríjol',
      compatible: true,
      status: 'compatible',
      humidityRange: '10-20%',
      phRange: '6.5-7.5',
      nutrientsRange: '0-2.0 dS/m',
      potassiumRange: '30-40',
      phosphorusRange: '40-60',
      nitrogenRange: '20-60',
      soilTempRange: '18-26',
      airTempRange: '10-27',
      recommendation: '15% de humedad es óptimo. pH entre 6.5-7.5. CE no debe ser mayor a 2 mmhos/cm. Requiere suelos bien drenados. Temperatura óptima 10-27°C.'
    },
    arveja: {
      name: 'Arveja',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-75%',
      phRange: '6.0-7.0',
      nutrientsRange: '0-2.5 dS/m',
      potassiumRange: '70-70',
      phosphorusRange: '20-20',
      nitrogenRange: '150-150',
      soilTempRange: '15-23',
      airTempRange: '15-23',
      recommendation: 'Riego entre 250-380 mm bien distribuidos. pH óptimo 6.0-7.0. CE máxima tolerable de 2.5 dS/m. Temperatura óptima 15-23°C.'
    },
    limon: {
      name: 'Limón',
      compatible: true,
      status: 'compatible',
      humidityRange: '85-90%',
      phRange: '6.0-7.5',
      nutrientsRange: '0-2.0 dS/m',
      potassiumRange: '300-600',
      phosphorusRange: '0.11-0.16',
      nitrogenRange: '200-200',
      soilTempRange: '25-30',
      airTempRange: '18-38',
      recommendation: 'Humedad relativa ideal 85-90%. pH entre 6.0-7.5. CE menor a 2-4 dS/m para minimizar estrés en cítricos. Temperatura mínima 18°C, máxima 38°C.'
    },
    mango: {
      name: 'Mango',
      compatible: true,
      status: 'compatible',
      humidityRange: '70-75%',
      phRange: '5.5-7.0',
      nutrientsRange: '0-1.5 dS/m',
      potassiumRange: '0.25-0.40',
      phosphorusRange: '60-80',
      nitrogenRange: '0-10',
      soilTempRange: '27-27',
      airTempRange: '27-27',
      recommendation: 'Humedad relativa durante crecimiento 70-75%. pH ideal entre 5.5-7.0. CE por debajo de 1.5 dS/m en extracto de suelo. Temperatura promedio óptima 27°C.'
    },
    naranja: {
      name: 'Naranja',
      compatible: true,
      status: 'compatible',
      humidityRange: '35-80%',
      phRange: '5.0-6.0',
      nutrientsRange: '0.5-6.5 dS/m',
      potassiumRange: '150-200',
      phosphorusRange: '25-50',
      nitrogenRange: '150-200',
      soilTempRange: '22-27',
      airTempRange: '23-34',
      recommendation: 'Humedad relativa puede ir de 35-80%. pH adecuado entre 5-6. CE entre 0.5-6.5 dS/m (S/m) es tolerable. Temperatura óptima 23-34°C.'
    },
    nopal: {
      name: 'Nopal',
      compatible: false,
      status: 'no-compatible',
      humidityRange: '30-50%',
      phRange: '6.0-8.0',
      nutrientsRange: '2.0-4.0 dS/m',
      potassiumRange: '300-300',
      phosphorusRange: '122-122',
      nitrogenRange: '227-227',
      soilTempRange: '20-30',
      airTempRange: '22-30',
      recommendation: 'Requiere baja humedad 250-800 mm anuales. pH entre 6.0-8.0. CE óptima alrededor de 2-4 dS/m. Tolera condiciones áridas. Temperatura óptima 22-30°C.'
    },
    zanahoria: {
      name: 'Zanahoria',
      compatible: true,
      status: 'compatible',
      humidityRange: '70-80%',
      phRange: '5.8-7.0',
      nutrientsRange: '0-2.0 dS/m',
      potassiumRange: '300-300',
      phosphorusRange: '100-100',
      nitrogenRange: '120-120',
      soilTempRange: '13-24',
      airTempRange: '15-21',
      recommendation: 'Humedad del suelo al 70-80%. pH ideal entre 5.8-7.0. Conductividad eléctrica máxima de 2 dS/m para mejor desarrollo. Temperatura óptima 15-21°C.'
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-2 sticky top-0 z-50">
        <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#7cb342]" />
        <span className="text-sm sm:text-base">Panel de Información</span>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative">
        <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=500&fit=crop"
              alt="Rural landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/70"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            {/* Logo and Title */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#7cb342] flex items-center justify-center">
                <Sprout className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl mb-0">
                  Proyecto<br />
                  <span>Sembrando Bits</span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mb-3 sm:mb-4 max-w-xl text-sm sm:text-base px-4">
              Sistema IoT para monitorear variables de suelo y aire en entornos rurales
            </p>

            {/* Description */}
            <p className="mb-6 sm:mb-8 max-w-2xl text-xs sm:text-sm px-4">
              Una plataforma co-creada con mujeres rurales para potenciar la agricultura sostenible y el conocimiento local, transformando datos en decisiones inteligentes para un futuro más verde.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={() => document.getElementById('medio')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#7cb342] hover:bg-[#689f38] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              Explorar sensores
            </Button>
          </div>
        </div>

        {/* Footer Icons */}
        <div className="bg-[#f5f5dc] py-6 px-4">
          <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-center">Cultivo</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-center">Tierra</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-center">Datos</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-center">Colaboración</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[60px]">
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs text-center">Ambiente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Select Medium Section */}
      <section id="medio" className="bg-[#f5f5dc] py-8 sm:py-12 px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl mb-6 sm:mb-8">
          Selecciona el Medio a explorar
        </h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Terreno Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7cb342]/10 flex items-center justify-center mb-3 sm:mb-4">
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl text-[#7cb342] mb-2 sm:mb-3">Terreno</h3>
            <p className="text-center text-xs sm:text-sm mb-4 sm:mb-6">
              Explora sensores del suelo (humedad, pH, nutrientes).
            </p>
            <Button 
              onClick={() => handleMedioSelection('terreno')}
              className={`${
                selectedMedio === 'terreno' 
                  ? 'bg-[#7cb342] hover:bg-[#689f38]' 
                  : 'bg-[#9ccc65] hover:bg-[#8bc34a]'
              } text-white px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[44px]`}
            >
              Haz click aquí
            </Button>
          </div>

          {/* Aire Card */}
          <div className="bg-white rounded-lg p-6 sm:p-8 flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
              <Cloud className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl text-blue-500 mb-2 sm:mb-3">Aire</h3>
            <p className="text-center text-xs sm:text-sm mb-4 sm:mb-6">
              Explora sensores del entorno (temperatura, gases, humedad).
            </p>
            <Button 
              onClick={() => handleMedioSelection('aire')}
              className={`${
                selectedMedio === 'aire' 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-blue-400 hover:bg-blue-500'
              } text-white px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[44px]`}
            >
              Haz click aquí
            </Button>
          </div>
        </div>
      </section>

      {/* SECCIONES DE TERRENO - Solo visible si selectedMedio === 'terreno' */}
      {selectedMedio === 'terreno' && (
        <>
          {/* Select Device Section */}
          <section id="dispositivo" className="bg-white py-8 sm:py-12 px-4 sm:px-6">
            <h2 className="text-center text-xl sm:text-2xl mb-6 sm:mb-8">
              Selecciona el dispositivo que quieres revisar
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Button
                  onClick={() => setSelectedDispositivo(selectedDispositivo === 1 ? null : 1)}
                  className={`${
                    selectedDispositivo === 1 
                      ? 'bg-[#ff8a65] hover:bg-[#ff7043]' 
                      : 'bg-[#ffab91] hover:bg-[#ff8a65]'
                  } text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base min-h-[44px]`}
                >
                  {selectedDispositivo === 1 && <Check className="w-4 h-4" />}
                  Dispositivo 1
                </Button>

                <Button
                  onClick={() => setSelectedDispositivo(selectedDispositivo === 2 ? null : 2)}
                  className={`${
                    selectedDispositivo === 2 
                      ? 'bg-[#66bb6a] hover:bg-[#4caf50]' 
                      : 'bg-[#81c784] hover:bg-[#66bb6a]'
                  } text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base min-h-[44px]`}
                >
                  {selectedDispositivo === 2 && <Check className="w-4 h-4" />}
                  Dispositivo 2
                </Button>

                <Button
                  onClick={() => setSelectedDispositivo(selectedDispositivo === 3 ? null : 3)}
                  className={`${
                    selectedDispositivo === 3 
                      ? 'bg-[#ffd54f] hover:bg-[#ffca28]' 
                      : 'bg-[#ffe082] hover:bg-[#ffd54f]'
                  } text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base min-h-[44px]`}
                >
                  {selectedDispositivo === 3 && <Check className="w-4 h-4" />}
                  Dispositivo 3
                </Button>
              </div>

              {/* Desplegable de sensores */}
              {selectedDispositivo && (
                <div className="mt-6 sm:mt-8 bg-[#f5f5dc] rounded-lg p-4 sm:p-8">
                  <h3 className="text-center text-lg sm:text-xl mb-4 sm:mb-6">
                    Sensores del {dispositivoSensores[selectedDispositivo].nombre}
                  </h3>

                  {loading && (
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 text-[#7cb342]">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7cb342]"></div>
                        Cargando datos...
                      </div>
                    </div>
                  )}

                  {/* Indicador de última actualización */}
                  {dataAge[selectedDispositivo] && (
                    <div className="text-center mb-4 text-xs text-gray-500">
                      Última actualización: {new Date(dataAge[selectedDispositivo]!).toLocaleTimeString('es-ES')}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {dispositivoSensores[selectedDispositivo].sensores.map((sensor, index) => {
                      // Verificar si hay datos reales
                      const realData = sensorData[selectedDispositivo];
                      const hasRealData = realData && realData[sensor.nombre] !== undefined && realData[sensor.nombre] !== null;

                      return (
                        <div key={index} className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-sm relative">
                          {hasRealData && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Datos en tiempo real"></div>
                          )}
                          {sensor.icon}
                          <h4 className="mt-3 mb-2 text-center text-sm sm:text-base">{sensor.nombre}</h4>
                          <div className="text-2xl sm:text-3xl text-[#7cb342] mb-2 font-semibold">{sensor.valor}</div>
                          <p className="text-xs text-center text-gray-600">
                            {sensor.descripcion}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Select Crop Section */}
          <section id="cultivo" className="bg-[#f5f5dc] py-8 sm:py-12 px-4 sm:px-6">
            <h2 className="text-center text-xl sm:text-2xl mb-6 sm:mb-8">
              Selecciona el cultivo que quieres revisar
            </h2>
            
            <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-sm">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden mb-2 sm:mb-3 bg-gray-100">
                    <ImageWithFallback
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mb-2 sm:mb-3 text-sm sm:text-base">{crop.name}</h3>
                  <Button 
                    onClick={() => handleCropSelection(crop.id)}
                    className="bg-[#9ccc65] hover:bg-[#8bc34a] text-white text-xs px-3 sm:px-4 py-2 min-h-[44px] w-full"
                  >
                    Haz click aquí
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Crop Analysis Section */}
          {selectedCrop && (() => {
            const cropAnalysis = calculateCropCompatibility(selectedCrop);
            
            return (
              <section id="crop-analysis" className="bg-white py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-center text-xl sm:text-2xl mb-6 sm:mb-8">
                    Análisis del cultivo: {cropAnalysis.name}
                  </h2>

                  <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-8 mb-4 sm:mb-6">
                    {/* Iconos de estado - PLACEHOLDER para logosímbolos de Sembrando Bits */}
                    <div className="flex justify-center gap-4 sm:gap-8 mb-6">
                      <button
                        onClick={() => setAirQualityStatus('bueno')}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
                          cropAnalysis.status === 'compatible'
                            ? 'bg-[#4caf50] ring-4 ring-[#4caf50]/50 scale-110'
                            : 'bg-[#4caf50] opacity-30'
                        }`}
                        disabled
                      >
                        {/* PLACEHOLDER: Aquí irá el logosímbolo verde de Sembrando Bits */}
                        <img src={compatible} alt="Compatible" className="w-full h-full object-contain"/>
                      </button>
                      <button
                        onClick={() => setAirQualityStatus('moderado')}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
                          cropAnalysis.status === 'revisar'
                            ? 'bg-[#ffeb3b] ring-4 ring-[#ffeb3b]/50 scale-110'
                            : 'bg-[#ffeb3b] opacity-30'
                        }`}
                        disabled
                      >
                        {/* PLACEHOLDER: Aquí irá el logosímbolo amarillo de Sembrando Bits */}
                        <img src={neutral} alt="Neutral" className="w-full h-full object-contain"/>
                      </button>
                      <button
                        onClick={() => setAirQualityStatus('malo')}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
                          cropAnalysis.status === 'no-compatible'
                            ? 'bg-[#f44336] ring-4 ring-[#f44336]/50 scale-110'
                            : 'bg-[#f44336] opacity-30'
                        }`}
                        disabled
                      >
                        {/* PLACEHOLDER: Aquí irá el logosímbolo rojo de Sembrando Bits */}
                        <img src={noCompatible} alt="No Compatible" className="w-full h-full object-contain"/>
                      </button>
                    </div>

                    {/* Estado con mayor jerarquía visual */}
                    <div className="text-center mb-4 sm:mb-6">
                      {cropAnalysis.status === 'compatible' && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#4caf50] rounded-xl border-4 border-[#4caf50] shadow-lg">
                          <Check className="w-8 h-8 text-white" strokeWidth={3} />
                          <span className="text-3xl sm:text-4xl text-white tracking-wide">Compatible</span>
                        </div>
                      )}
                      {cropAnalysis.status === 'revisar' && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#ffeb3b] rounded-xl border-4 border-[#ffeb3b] shadow-lg">
                          <span className="text-3xl sm:text-4xl text-gray-800 tracking-wide">⚠️ Revisar condiciones</span>
                        </div>
                      )}
                      {cropAnalysis.status === 'no-compatible' && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#f44336] rounded-xl border-4 border-[#f44336] shadow-lg">
                          <span className="text-3xl sm:text-4xl text-white tracking-wide">✕ No Compatible</span>
                        </div>
                      )}
                      {selectedDispositivo && sensorData[selectedDispositivo] && (
                        <p className="text-xs mt-3 text-gray-600">
                          Análisis basado en datos en tiempo real del Dispositivo {selectedDispositivo}
                        </p>
                      )}
                    </div>

                    <p className="text-center mb-6 sm:mb-8 text-base sm:text-lg px-4">
                      {cropAnalysis.recommendation}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {/* Humedad */}
                      <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                        <Droplet className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                        <h3 className="mb-2 text-sm sm:text-base text-center">Rango de Humedad</h3>
                        <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropAnalysis.humidityRange}</div>
                      </div>

                      {/* pH */}
                      <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                        <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                        <h3 className="mb-2 text-sm sm:text-base text-center">Rango de pH</h3>
                        <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropAnalysis.phRange}</div>
                      </div>

                    {/* Nutrientes */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                      <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                      <h3 className="mb-2 text-sm sm:text-base text-center">Rango de Nutrientes</h3>
                      <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropAnalysis.nutrientsRange}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
        </>
      )}

      {/* SECCIÓN DE AIRE - Solo visible si selectedMedio === 'aire' */}
      {selectedMedio === 'aire' && (
        <section id="aire-analisis" className="bg-[#e3f2fd] py-8 sm:py-12 px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl mb-3 sm:mb-4">
            Análisis de calidad del aire
          </h2>
          
          <p className="text-center italic mb-6 sm:mb-8 text-sm sm:text-base">
            El aire huele a montaña despejada.
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-lg p-4 sm:p-8 mb-4 sm:mb-6">
            <div className="flex justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
              <button
                onClick={() => setAirQualityStatus('bueno')}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                  airQualityStatus === 'bueno'
                    ? 'bg-[#4caf50] ring-4 ring-[#4caf50]/50 scale-110'
                    : 'bg-[#4caf50] opacity-30'
                }`}
              >
                <img src={compatible} alt="Good Air Quality" className="w-full h-full object-contain"/>
              </button>
              <button
                onClick={() => setAirQualityStatus('moderado')}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                  airQualityStatus === 'moderado'
                    ? 'bg-[#ffeb3b] ring-4 ring-[#ffeb3b]/50 scale-110'
                    : 'bg-[#ffeb3b] opacity-30'
                }`}
              >
                <img src={neutral} alt="Moderate Air Quality" className="w-full h-full object-contain"/>
              </button>
              <button
                onClick={() => setAirQualityStatus('malo')}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                  airQualityStatus === 'malo'
                    ? 'bg-[#f44336] ring-4 ring-[#f44336]/50 scale-110'
                    : 'bg-[#f44336] opacity-30'
                }`}
              >
                <img src={noCompatible} alt="Poor Air Quality" className="w-full h-full object-contain"/>
              </button>
            </div>

            <p className="text-center mb-3 sm:mb-4 text-sm sm:text-base">
              Nuestros sensores indican un ambiente con <span className="inline-block px-3 py-1 bg-gray-100 rounded">Aire Limpio</span><br />
              y óptimo para el desarrollo de tus cultivos.
            </p>

            <p className="text-center italic text-xs sm:text-sm">
              "El aire huele a montaña despejada, un aliento puro para tu tierra."
            </p>
          </div>

          <h3 className="text-center text-lg sm:text-xl mb-6 sm:mb-8">Sensores del Aire</h3>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Temperatura */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl text-red-500">🌡️</span>
              </div>
              <h4 className="mb-3 text-sm sm:text-base">Temperatura</h4>
              <div className="text-3xl sm:text-4xl text-[#2196f3] mb-4">25°C</div>
              <p className="text-xs sm:text-sm text-center">
                Temperatura óptima para el crecimiento
              </p>
            </div>

            {/* Humedad Relativa */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl text-blue-500">💧</span>
              </div>
              <h4 className="mb-3 text-sm sm:text-base">Humedad Relativa</h4>
              <div className="text-3xl sm:text-4xl text-[#2196f3] mb-4">60%</div>
              <p className="text-xs sm:text-sm text-center">
                Niveles ideales de humedad
              </p>
            </div>

            {/* Concentración de Gases */}
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl text-purple-500">🏭</span>
              </div>
              <h4 className="mb-3 text-sm sm:text-base">Concentración de Gases</h4>
              <div className="text-3xl sm:text-4xl text-[#2196f3] mb-4">15ppm</div>
              <p className="text-xs sm:text-sm text-center">
                Aire limpio, baja concentración de contaminantes
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recomendaciones Generales Section - Solo visible cuando se ha seleccionado TERRENO */}
      {selectedMedio === 'terreno' && (
        <section id="recomendaciones" className="bg-white py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-xl sm:text-2xl mb-3 sm:mb-4">
              Recomendaciones generales para mejorar tu cultivo
            </h2>
            
            <p className="text-center italic mb-6 sm:mb-8 text-sm sm:text-base text-gray-600">
              Consejos prácticos basados en el conocimiento local y la ciencia
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Recomendación 1 - Monitoreo constante */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#7cb342]/20 flex items-center justify-center">
                    <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-[#7cb342]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Monitoreo constante</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Revisa tus sensores regularmente. La tierra habla, solo hay que saber escucharla. 
                    Observa cambios en humedad, pH y nutrientes cada semana.
                  </p>
                </div>
              </div>

              {/* Recomendación 2 - Rotación de cultivos */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#7cb342]/20 flex items-center justify-center">
                    <Wheat className="w-6 h-6 sm:w-7 sm:h-7 text-[#7cb342]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Rotación de cultivos</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Alterna tus cultivos cada temporada. Esto ayuda a que la tierra recupere nutrientes 
                    y previene plagas. El maíz después de frijoles enriquece el suelo.
                  </p>
                </div>
              </div>

              {/* Recomendación 3 - Riego eficiente */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Droplet className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Riego eficiente</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Riega en las mañanas temprano o al atardecer. Evita el agua en exceso - la tierra 
                    debe estar húmeda pero no encharcada. Ahorra agua, cuida tus raíces.
                  </p>
                </div>
              </div>

              {/* Recomendación 4 - Fertilización natural */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Fertilización natural</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Usa composta y abonos orgánicos. Las cáscaras, restos de plantas y estiércol 
                    enriquecen la tierra sin químicos. La naturaleza sabe nutrirse sola.
                  </p>
                </div>
              </div>

              {/* Recomendación 5 - Control de plagas natural */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Control de plagas natural</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Planta hierbas aromáticas entre tus cultivos. El cilantro, albahaca y romero 
                    alejan plagas naturalmente. La biodiversidad es tu mejor aliada.
                  </p>
                </div>
              </div>

              {/* Recomendación 6 - Protección del suelo */}
              <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <Cloud className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-sm sm:text-base">Protección del suelo</h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Cubre la tierra con paja o residuos vegetales (mulch). Esto conserva la humedad, 
                    controla la temperatura y previene la erosión. Protege tu tierra como ella te protege.
                  </p>
                </div>
              </div>
            </div>

            {/* Banner de mensaje especial */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-[#7cb342] to-[#8bc34a] rounded-lg p-4 sm:p-6 text-white text-center">
              <p className="text-sm sm:text-base mb-2">
                💚 Recuerda: cada planta es única, cada tierra tiene su historia.
              </p>
              <p className="text-xs sm:text-sm italic">
                "El conocimiento ancestral y la tecnología moderna juntos hacen crecer mejores cosechas."
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Rating Section */}
      <section id="rating" className="bg-[#f5f5dc] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl mb-4 sm:mb-6">
            ¿Consideras que esta información te fue de utilidad?
          </h2>

          <div className="flex justify-center gap-2 mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Star
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="mb-4 sm:mb-6 text-xs sm:text-sm px-4">
            Recuerda: la tecnología también florece en tus manos. Cuida tu cultivo, cuida tu tierra.
          </p>

          <Button 
            onClick={scrollToTop}
            className="bg-[#7cb342] hover:bg-[#689f38] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base min-h-[44px]"
          >
            Volver al inicio
          </Button>
        </div>
      </section>

      {/* Footer Icons */}
      <section className="bg-[#f5f5dc] py-6 px-4">
        <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs text-center">Cultivo</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <Droplet className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs text-center">Tierra</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs text-center">Datos</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs text-center">Colaboración</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[60px]">
            <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs text-center">Ambiente</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 sm:py-8 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4 text-justify">
            Este proyecto fue posible gracias a la financiación del Ministerio de Ciencia, Tecnología e Innovación de Colombia. Convocatoria No. 948-2024, "Convocatoria Orquídeas: Mujeres en la Ciencia 2024", FONDO NACIONAL DE FINANCIAMIENTO PARA LA CIENCIA, LA TECNOLOGÍA Y LA INNOVACIÓN FRANCISCO JOSÉ DE CALDAS, Contrato No. 112721-234-2024, Proyecto código 109276 "SembrandoBits: Empoderando a la mujer agricultora mediante la transformación digital".
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">
            Diseño y desarrollo tecnológico realizados por el Centro de Desarrollo Tecnológico Smart Regions Center (CDT-SRC).
          </p>
          <p className="text-xs text-gray-500">
            © 2025 Panel de información. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
