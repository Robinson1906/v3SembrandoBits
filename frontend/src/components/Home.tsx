import React, { useState, useEffect } from 'react';
import { Sprout, Wheat, Droplet, Heart, Cloud, Leaf, Check, Star, Thermometer, Zap, FlaskConical } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import image2 from '../assets/2.png';
import image12 from '../assets/12.png';
import neutral from '../assets/neutral.png';

const crops = [
  {
    id: 'maiz',
    name: 'Maíz',
    image: 'https://images.unsplash.com/photo-1608995855173-bb65a3fe1bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwbWFpemUlMjBjcm9wfGVufDF8fHx8MTc2Mjk1NzA5NHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'tabaco',
    name: 'Tabaco',
    image: 'https://images.unsplash.com/photo-1758414083946-df1b3b44ce84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2JhY2NvJTIwbGVhdmVzJTIwcGxhbnR8ZW58MXx8fHwxNzYyOTU3MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'nopal',
    name: 'Nopal',
    image: 'https://images.unsplash.com/photo-1708289455563-f42d5cb97bfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3BhbCUyMGNhY3R1c3xlbnwxfHx8fDE3NjI5NTcwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'lima',
    name: 'Lima',
    image: 'https://images.unsplash.com/photo-1616963738682-9df1389e5932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW1lJTIwY2l0cnVzJTIwZnJ1aXR8ZW58MXx8fHwxNzYyOTU3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'frijoles',
    name: 'Frijoles',
    image: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFucyUyMGxlZ3VtZXN8ZW58MXx8fHwxNzYyOTU3MDk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export default function Home() {
  const [selectedMedio, setSelectedMedio] = useState<'terreno' | 'aire' | null>(null);
  const [selectedDispositivo, setSelectedDispositivo] = useState<1 | 2 | 3 | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [airQualityStatus, setAirQualityStatus] = useState<'bueno' | 'moderado' | 'malo'>('bueno');
  const [sensorData, setSensorData] = useState<Record<1 | 2 | 3, any>>({} as Record<1 | 2 | 3, any>);
  const [loading, setLoading] = useState(false);

  // Fetch real sensor data when device is selected
  useEffect(() => {
    if (selectedDispositivo) {
      setLoading(true);
      fetch(`/api/medidas/dispositivo/${selectedDispositivo}`)
        .then(res => res.json())
        .then(data => {
          if (data.datos) {
            setSensorData(prev => ({ ...prev, [selectedDispositivo]: data.datos }));
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching sensor data:', err);
          setLoading(false);
        });
    }
  }, [selectedDispositivo]);

  const scrollToTop = () => {
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

  // Datos completos de sensores por dispositivo (7 sensores)
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
      nombre: 'Dispositivo 1',
      sensores: [
        {
          nombre: 'Humedad del suelo',
          valor: '65%',
          descripcion: 'Es como cuando la tierra que se pega en la mano',
          icon: <Droplet className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'pH del suelo',
          valor: '6.2',
          descripcion: 'Se parece al sabor agrio o salado que deja en la boca al probar la tierra',
          icon: <Leaf className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Temperatura del suelo',
          valor: '22°C',
          descripcion: 'Tierra fresca, como cuando el sol apenas empieza a calentar',
          icon: <Thermometer className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Conductividad eléctrica',
          valor: '2.5 dS/m',
          descripcion: 'Está desnutrido el terreno, hay que darle más amor',
          icon: <Zap className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Nitrógeno (N)',
          valor: '45 ppm',
          descripcion: 'Nivel moderado, las plantas pueden crecer pero necesitan más',
          icon: <FlaskConical className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Fósforo (P)',
          valor: '18 ppm',
          descripcion: 'Bajo en fósforo, las raíces necesitan más alimento',
          icon: <Sprout className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Potasio (K)',
          valor: '120 ppm',
          descripcion: 'Buen nivel de potasio para frutos sanos',
          icon: <Wheat className="w-10 h-10 text-[#7cb342]" />
        }
      ]
    },
    2: {
      nombre: 'Dispositivo 2',
      sensores: [
        {
          nombre: 'Humedad del suelo',
          valor: '72%',
          descripcion: 'Tierra bien húmeda, como después de una buena lluvia',
          icon: <Droplet className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'pH del suelo',
          valor: '6.8',
          descripcion: 'Tierra con buen equilibrio, ni muy ácida ni muy alcalina',
          icon: <Leaf className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Temperatura del suelo',
          valor: '24°C',
          descripcion: 'Tierra tibia, perfecta para la siembra',
          icon: <Thermometer className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Conductividad eléctrica',
          valor: '3.2 dS/m',
          descripcion: 'Tierra bien alimentada, lista para dar buenos frutos',
          icon: <Zap className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Nitrógeno (N)',
          valor: '65 ppm',
          descripcion: 'Buen nivel de nitrógeno, hojas verdes y sanas',
          icon: <FlaskConical className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Fósforo (P)',
          valor: '28 ppm',
          descripcion: 'Nivel óptimo para raíces fuertes',
          icon: <Sprout className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Potasio (K)',
          valor: '155 ppm',
          descripcion: 'Excelente nivel para resistencia de la planta',
          icon: <Wheat className="w-10 h-10 text-[#7cb342]" />
        }
      ]
    },
    3: {
      nombre: 'Dispositivo 3',
      sensores: [
        {
          nombre: 'Humedad del suelo',
          valor: '58%',
          descripcion: 'Tierra un poco seca, necesita más agua',
          icon: <Droplet className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'pH del suelo',
          valor: '5.9',
          descripcion: 'Tierra ligeramente ácida, buena para algunos cultivos',
          icon: <Leaf className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Temperatura del suelo',
          valor: '20°C',
          descripcion: 'Tierra fresca, ideal para cultivos de clima templado',
          icon: <Thermometer className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Conductividad eléctrica',
          valor: '1.8 dS/m',
          descripcion: 'Le faltan nutrientes, hay que fertilizar',
          icon: <Zap className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Nitrógeno (N)',
          valor: '35 ppm',
          descripcion: 'Bajo en nitrógeno, necesita abono',
          icon: <FlaskConical className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Fósforo (P)',
          valor: '12 ppm',
          descripcion: 'Muy bajo, las raíces no se desarrollarán bien',
          icon: <Sprout className="w-10 h-10 text-[#7cb342]" />
        },
        {
          nombre: 'Potasio (K)',
          valor: '95 ppm',
          descripcion: 'Nivel aceptable pero puede mejorar',
          icon: <Wheat className="w-10 h-10 text-[#7cb342]" />
        }
      ]
    }
  };

  // Datos de compatibilidad de cultivos
  const cropCompatibility: Record<string, {
    name: string;
    compatible: boolean;
    status: 'compatible' | 'revisar' | 'no-compatible';
    humidityRange: string;
    phRange: string;
    nutrientsRange: string;
    recommendation: string;
  }> = {
    maiz: {
      name: 'Maíz',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-70%',
      phRange: '6.0-7.0',
      nutrientsRange: '2.0-3.0 dS/m',
      recommendation: 'Excelente opción. El suelo tiene las condiciones perfectas para cultivar maíz. La humedad y pH están en niveles ideales.'
    },
    tabaco: {
      name: 'Tabaco',
      compatible: false,
      status: 'revisar',
      humidityRange: '50-60%',
      phRange: '5.5-6.5',
      nutrientsRange: '1.5-2.5 dS/m',
      recommendation: 'El nivel de humedad actual es ligeramente alto para tabaco. Se sugiere mejorar el drenaje.'
    },
    nopal: {
      name: 'Nopal',
      compatible: false,
      status: 'no-compatible',
      humidityRange: '30-50%',
      phRange: '6.0-8.0',
      nutrientsRange: '1.0-2.0 dS/m',
      recommendation: 'El nopal prefiere suelos más secos. La humedad actual es muy alta para este cultivo.'
    },
    lima: {
      name: 'Lima',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-70%',
      phRange: '6.0-7.0',
      nutrientsRange: '2.0-3.5 dS/m',
      recommendation: 'Buena opción. Las condiciones del suelo son favorables para lima. El pH y la humedad están en rangos óptimos.'
    },
    frijoles: {
      name: 'Frijoles',
      compatible: true,
      status: 'compatible',
      humidityRange: '60-75%',
      phRange: '6.0-7.5',
      nutrientsRange: '1.5-3.0 dS/m',
      recommendation: 'Muy recomendado. Los frijoles prosperarán en estas condiciones. El suelo tiene nutrientes adecuados.'
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {dispositivoSensores[selectedDispositivo].sensores.map((sensor, index) => {
                      // Get real data if available
                      const realData = sensorData[selectedDispositivo];
                      let displayValue = "N/A"; // Default to N/A for missing data

                      if (realData && realData[sensor.nombre] !== undefined && realData[sensor.nombre] !== null) {
                        const value = realData[sensor.nombre];
                        // Format values based on sensor type
                        if (sensor.nombre === 'Humedad del suelo') {
                          displayValue = `${value}%`;
                        } else if (sensor.nombre === 'pH del suelo') {
                          displayValue = value.toString();
                        } else if (sensor.nombre === 'Temperatura del suelo') {
                          displayValue = `${value}°C`;
                        } else if (sensor.nombre === 'Conductividad eléctrica') {
                          displayValue = `${value} dS/m`;
                        } else if (sensor.nombre.includes('Nitrógeno') || sensor.nombre.includes('Fósforo') || sensor.nombre.includes('Potasio')) {
                          displayValue = `${value} ppm`;
                        } else {
                          displayValue = value.toString();
                        }
                      } else if (realData && realData[sensor.nombre] === null) {
                        displayValue = "null"; // Explicitly show null for missing values
                      }

                      return (
                        <div key={index} className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-sm">
                          {sensor.icon}
                          <h4 className="mt-3 mb-2 text-center text-sm sm:text-base">{sensor.nombre}</h4>
                          <div className="text-2xl sm:text-3xl text-[#7cb342] mb-2">{displayValue}</div>
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
          {selectedCrop && (
            <section id="crop-analysis" className="bg-white py-8 sm:py-12 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-center text-xl sm:text-2xl mb-6 sm:mb-8">
                  Análisis del cultivo: {cropCompatibility[selectedCrop].name}
                </h2>

                <div className="bg-[#f5f5dc] rounded-lg p-4 sm:p-8 mb-4 sm:mb-6">
                  {/* Iconos de estado - PLACEHOLDER para logosímbolos de Sembrando Bits */}
                  <div className="flex justify-center gap-4 sm:gap-8 mb-6">
                    <button
                      onClick={() => setAirQualityStatus('bueno')}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
                        cropCompatibility[selectedCrop].status === 'compatible'
                          ? 'bg-[#4caf50] ring-4 ring-[#4caf50]/50 scale-110'
                          : 'bg-[#4caf50] opacity-30'
                      }`}
                      disabled
                    >
                      {/* PLACEHOLDER: Aquí irá el logosímbolo verde de Sembrando Bits */}
                      <img src={image2} alt="Compatible" className="w-full h-full object-contain"/>
                    </button>
                    <button
                      onClick={() => setAirQualityStatus('moderado')}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all ${
                        cropCompatibility[selectedCrop].status === 'revisar'
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
                        cropCompatibility[selectedCrop].status === 'no-compatible'
                          ? 'bg-[#f44336] ring-4 ring-[#f44336]/50 scale-110'
                          : 'bg-[#f44336] opacity-30'
                      }`}
                      disabled
                    >
                      {/* PLACEHOLDER: Aquí irá el logosímbolo rojo de Sembrando Bits */}
                      <img src={image12} alt="No Compatible" className="w-full h-full object-contain"/>
                    </button>
                  </div>

                  {/* Estado con mayor jerarquía visual */}
                  <div className="text-center mb-4 sm:mb-6">
                    {cropCompatibility[selectedCrop].status === 'compatible' && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#4caf50] rounded-xl border-4 border-[#4caf50] shadow-lg">
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        <span className="text-3xl sm:text-4xl text-white tracking-wide">Compatible</span>
                      </div>
                    )}
                    {cropCompatibility[selectedCrop].status === 'revisar' && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#ffeb3b] rounded-xl border-4 border-[#ffeb3b] shadow-lg">
                        <span className="text-3xl sm:text-4xl text-gray-800 tracking-wide">⚠️ Revisar condiciones</span>
                      </div>
                    )}
                    {cropCompatibility[selectedCrop].status === 'no-compatible' && (
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#f44336] rounded-xl border-4 border-[#f44336] shadow-lg">
                        <span className="text-3xl sm:text-4xl text-white tracking-wide">✕ No Compatible</span>
                      </div>
                    )}
                  </div>

                  <p className="text-center mb-6 sm:mb-8 text-base sm:text-lg px-4">
                    {cropCompatibility[selectedCrop].recommendation}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {/* Humedad */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                      <Droplet className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                      <h3 className="mb-2 text-sm sm:text-base text-center">Rango de Humedad</h3>
                      <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropCompatibility[selectedCrop].humidityRange}</div>
                    </div>

                    {/* pH */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                      <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                      <h3 className="mb-2 text-sm sm:text-base text-center">Rango de pH</h3>
                      <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropCompatibility[selectedCrop].phRange}</div>
                    </div>

                    {/* Nutrientes */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center">
                      <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-[#7cb342] mb-2 sm:mb-3" />
                      <h3 className="mb-2 text-sm sm:text-base text-center">Rango de Nutrientes</h3>
                      <div className="text-2xl sm:text-4xl text-[#7cb342] mb-2">{cropCompatibility[selectedCrop].nutrientsRange}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
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
                <img src={image2} alt="Good Air Quality" className="w-full h-full object-contain"/>
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
                <img src={image12} alt="Poor Air Quality" className="w-full h-full object-contain"/>
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

      {/* Recomendaciones Generales Section - Solo visible cuando NO se ha seleccionado AIRE */}
      {selectedMedio !== 'aire' && (
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
