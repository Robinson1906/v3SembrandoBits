import React, { useEffect, useState } from "react";
import { SensorCard } from "./SensorCard";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  Thermometer, 
  Droplets, 
  TestTube, 
  Wifi, 
  Battery, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  WifiOff,
  Activity
} from "lucide-react";

interface DashboardData {
  connected: boolean;
  sensorData: any[];
  lastUpdate: string;
}

interface Medida {
  sensor: string;
  nombre_campo: string;
  valor: string | number;
  fecha: string;
}

export function DashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    connected: false,
    sensorData: [],
    lastUpdate: ""
  });

  const API_BASE_URL = "http://200.91.211.22:8860";

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const loadDashboardData = async () => {
    try {
      const connected = await checkServerConnection();
      
      if (!connected) {
        setDashboardData(prev => ({ ...prev, connected: false }));
        return;
      }

      // Obtener medidas más recientes
      const medidasResponse = await fetch(`${API_BASE_URL}/medidas`);
      const medidas: Medida[] = await medidasResponse.json();

      // Procesar los datos para el dashboard
      const sensorMap = new Map();
      
      medidas.forEach(medida => {
        const key = medida.sensor;
        if (!sensorMap.has(key)) {
          sensorMap.set(key, {
            sensor: key,
            campos: new Map(),
            lastUpdate: medida.fecha
          });
        }
        
        sensorMap.get(key).campos.set(medida.nombre_campo, {
          valor: medida.valor,
          fecha: medida.fecha
        });
      });

      // Convertir a formato para SensorCard
      const sensorData = Array.from(sensorMap.values()).map(sensor => {
        const campos = sensor.campos;
        
        // Mapear campos comunes a sensores del dashboard
        const getSensorCardData = () => {
          if (campos.has("humedad_suelo")) {
            const humedad = parseFloat(campos.get("humedad_suelo").valor);
            return {
              title: "Humedad del Suelo",
              value: humedad.toFixed(1),
              unit: "%",
              status: humedad >= 60 && humedad <= 80 ? "good" : humedad >= 40 ? "warning" : "danger",
              icon: Droplets,
              description: `Sensor: ${sensor.sensor}`
            };
          } else if (campos.has("temperatura")) {
            const temp = parseFloat(campos.get("temperatura").valor);
            return {
              title: "Temperatura",
              value: temp.toFixed(1),
              unit: "°C",
              status: temp >= 20 && temp <= 30 ? "good" : temp >= 15 && temp <= 35 ? "warning" : "danger",
              icon: Thermometer,
              description: `Sensor: ${sensor.sensor}`
            };
          } else if (campos.has("ph_nivel")) {
            const ph = parseFloat(campos.get("ph_nivel").valor);
            return {
              title: "pH del Suelo",
              value: ph.toFixed(1),
              unit: "",
              status: ph >= 6.0 && ph <= 7.5 ? "good" : ph >= 5.5 && ph <= 8.0 ? "warning" : "danger",
              icon: TestTube,
              description: `Sensor: ${sensor.sensor}`
            };
          } else if (campos.has("nitrogeno")) {
            const nitrogeno = parseFloat(campos.get("nitrogeno").valor);
            return {
              title: "Nitrógeno",
              value: nitrogeno.toFixed(0),
              unit: "ppm",
              status: nitrogeno >= 40 && nitrogeno <= 80 ? "good" : nitrogeno >= 20 ? "warning" : "danger",
              icon: TestTube,
              description: `Sensor: ${sensor.sensor}`
            };
          } else {
            // Sensor genérico
            const primerCampo = Array.from(campos.entries())[0] as [string, { valor: string }];
            return {
              title: primerCampo[0].replace(/_/g, ' ').toUpperCase(),
              value: primerCampo[1].valor.toString(),
              unit: "",
              status: "good" as const,
              icon: MapPin,
              description: `Sensor: ${sensor.sensor}`
            };
          }
        };

        return getSensorCardData();
      });

      // Agregar sensores de estado del sistema
      const systemSensors = [
        {
          title: "Conectividad",
          value: "100",
          unit: "%",
          status: "good" as const,
          icon: Wifi,
          description: "Conexión al servidor activa"
        },
        {
          title: "Sensores Activos",
          value: sensorData.length.toString(),
          unit: "",
          status: sensorData.length > 0 ? "good" as const : "warning" as const,
          icon: Activity,
          description: `${sensorData.length} sensores reportando datos`
        }
      ];

      setDashboardData({
        connected: true,
        sensorData: [...sensorData, ...systemSensors],
        lastUpdate: new Date().toLocaleString()
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setDashboardData(prev => ({ 
        ...prev, 
        connected: false,
        sensorData: []
      }));
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Estado de Conexión */}
      <Alert className={dashboardData.connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        {dashboardData.connected ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={dashboardData.connected ? "text-green-800" : "text-red-800"}>
          <div className="flex items-center justify-between">
            <span>
              {dashboardData.connected ? (
                <>
                  <strong>Servidor Conectado:</strong> Datos en tiempo real disponibles
                </>
              ) : (
                <>
                  <strong>Servidor Desconectado:</strong> Verifica que el servidor Flask esté ejecutándose en http://200.91.211.22:8860
                </>
              )}
            </span>
            {dashboardData.connected && (
              <Badge variant="outline" className="text-xs">
                Última actualización: {dashboardData.lastUpdate}
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Grid de Sensores */}
      {dashboardData.connected && dashboardData.sensorData.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Estado de Sensores (Tiempo Real)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.sensorData.map((sensor, index) => (
              <SensorCard key={index} {...sensor} />
            ))}
          </div>
        </div>
      ) : dashboardData.connected ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No hay datos de sensores disponibles. Agrega sensores en la sección "Gestión" y envía algunas medidas.
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Estado de Sensores (Datos de Ejemplo)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Humedad del Suelo",
                value: "--",
                unit: "%",
                status: "danger" as const,
                icon: Droplets,
                description: "Sin conexión al servidor"
              },
              {
                title: "Temperatura",
                value: "--",
                unit: "°C",
                status: "danger" as const,
                icon: Thermometer,
                description: "Sin conexión al servidor"
              },
              {
                title: "pH del Suelo",
                value: "--",
                unit: "",
                status: "danger" as const,
                icon: TestTube,
                description: "Sin conexión al servidor"
              }
            ].map((sensor, index) => (
              <SensorCard key={index} {...sensor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}