import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Star, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Votacion {
  _id: string;
  rating: number;
  dispositivo?: number;
  cultivo?: string;
  medio?: string;
  timestamp: string;
}

interface Estadisticas {
  total_votaciones: number;
  promedio_rating: number;
  distribucion: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export function Calificaciones() {
  const [votaciones, setVotaciones] = useState<Votacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:8860";

  const cargarVotaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/votaciones?limit=50`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVotaciones(data.votaciones || []);
    } catch (err) {
      console.error("Error cargando votaciones:", err);
      toast.error("Error al cargar las votaciones");
      setVotaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/votaciones/estadisticas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEstadisticas(data);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
      setEstadisticas(null);
    }
  };

  useEffect(() => {
    cargarVotaciones();
    cargarEstadisticas();
  }, []);

  const formatearFecha = (timestamp: string) => {
    const fecha = new Date(timestamp);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEstrellas = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getBadgeColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const calcularPorcentaje = (cantidad: number, total: number) => {
    return total > 0 ? ((cantidad / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      {estadisticas && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Calificaciones
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total_votaciones}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todas las votaciones recibidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promedio General
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {estadisticas.promedio_rating}
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                De 5 estrellas posibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Distribución
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{rating}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBadgeColor(rating)}`}
                        style={{
                          width: `${calcularPorcentaje(
                            estadisticas.distribucion[rating.toString() as keyof typeof estadisticas.distribucion],
                            estadisticas.total_votaciones
                          )}%`
                        }}
                      />
                    </div>
                    <span className="w-12 text-right">
                      {estadisticas.distribucion[rating.toString() as keyof typeof estadisticas.distribucion]} (
                      {calcularPorcentaje(
                        estadisticas.distribucion[rating.toString() as keyof typeof estadisticas.distribucion],
                        estadisticas.total_votaciones
                      )}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Votaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Últimas 50 Calificaciones
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                cargarVotaciones();
                cargarEstadisticas();
              }}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {votaciones.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead>Cultivo</TableHead>
                    <TableHead>Medio</TableHead>
                    <TableHead className="text-right">Nivel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {votaciones.map((votacion) => (
                    <TableRow key={votacion._id}>
                      <TableCell className="font-mono text-xs">
                        {formatearFecha(votacion.timestamp)}
                      </TableCell>
                      <TableCell>
                        {renderEstrellas(votacion.rating)}
                      </TableCell>
                      <TableCell>
                        {votacion.dispositivo ? (
                          <Badge variant="outline">
                            Dispositivo {votacion.dispositivo}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {votacion.cultivo ? (
                          <span className="text-sm">{votacion.cultivo}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {votacion.medio ? (
                          <Badge 
                            variant={votacion.medio === 'terreno' ? 'default' : 'secondary'}
                          >
                            {votacion.medio}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={getBadgeColor(votacion.rating)}>
                          {votacion.rating >= 4 ? 'Excelente' : 
                           votacion.rating >= 3 ? 'Bueno' : 'Regular'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay calificaciones registradas aún</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
