import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { 
  Plus, 
  Edit, 
  Power, 
  Trash2, 
  Settings,
  Activity,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Link,
  Unlink
} from "lucide-react";
import { toast } from "sonner";
import { Calificaciones } from "./Calificaciones";

interface Campo {
  campo_id?: number;
  nombre_campo: string;
  tipo_campo: string;
}

interface Sensor {
  sensor_id?: number;
  sensor: string;
  tipo_sensor: string;
  activo: boolean;
  campos: Campo[];
  dispositivo_id?: string | null;
}

interface Medida {
  _id?: string;
  sensor: string;
  nombre_campo: string;
  valor: string | number | boolean;
  timestamp: string;
}

interface Dispositivo {
  _id: string;
  nombre: string;
  ubicacion?: string;
}

export function SensorManagement() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [nuevo, setNuevo] = useState<Sensor>({
    sensor: "",
    tipo_sensor: "",
    activo: true,
    campos: [{ nombre_campo: "", tipo_campo: "" }],
  });
  const [editando, setEditando] = useState<Sensor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [vinculaciones, setVinculaciones] = useState<Record<string, string | null>>({});
  const [vinculacionesOriginales, setVinculacionesOriginales] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);


  const API_BASE_URL = "http://200.91.211.22:8860";

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [sensoresRes, dispositivosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/listar_sensores_campos`),
        fetch(`${API_BASE_URL}/dispositivos`)
      ]);

      if (!sensoresRes.ok) throw new Error('Error al cargar sensores');
      if (!dispositivosRes.ok) throw new Error('Error al cargar dispositivos');

      const sensoresData = await sensoresRes.json();
      const dispositivosData = await dispositivosRes.json();

      setSensores(sensoresData);
      setDispositivos(dispositivosData);

      const initialVinculaciones = sensoresData.reduce((acc: Record<string, string | null>, sensor: Sensor) => {
        if (sensor.sensor_id) {
          acc[sensor.sensor_id] = sensor.dispositivo_id || null;
        }
        return acc;
      }, {});
      setVinculaciones(initialVinculaciones);
      setVinculacionesOriginales(initialVinculaciones);

    } catch (err) {
      console.error("Error cargando datos iniciales:", err);
      toast.error("Error al cargar datos. Verifica la conexión con el servidor.");
      setSensores([]);
      setDispositivos([]);
    } finally {
      setIsLoading(false);
    }
  };


  const cargarMedidas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medidas?limite=20`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedidas(data);
    } catch (err) {
      console.error("Error cargando medidas:", err);
      toast.error("Error al cargar las medidas");
      setMedidas([]);
    }
  };

  useEffect(() => {
    cargarDatos();
    cargarMedidas();
    const intervalo = setInterval(cargarMedidas, 10000); // 10 segundos para no sobrecargar
    return () => clearInterval(intervalo);
  }, []);

  const handleVinculacionChange = (sensorId: number, dispositivoId: string | null) => {
    setVinculaciones(prev => ({
      ...prev,
      [sensorId]: dispositivoId,
    }));
  };

  const guardarVinculaciones = async () => {
    const cambios = Object.entries(vinculaciones).filter(
      ([sensorId, dispositivoId]) => vinculacionesOriginales[sensorId] !== dispositivoId
    );

    if (cambios.length === 0) {
      toast.info("No hay cambios que guardar.");
      return;
    }

    toast.loading("Guardando cambios...");

    const promesas = cambios.map(([sensorId, dispositivoId]) => {
      const url = dispositivoId
        ? `${API_BASE_URL}/sensores/${sensorId}/vincular`
        : `${API_BASE_URL}/sensores/${sensorId}/desvincular`;
      
      const body = dispositivoId ? { dispositivo_id: dispositivoId } : {};

      return fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });

    try {
      const resultados = await Promise.all(promesas);
      const errores = resultados.filter(res => !res.ok);

      if (errores.length > 0) {
        throw new Error(`${errores.length} vinculaciones fallaron.`);
      }

      toast.dismiss();
      toast.success("¡Todas las vinculaciones se guardaron correctamente!");
      cargarDatos(); // Recargar para obtener el estado más reciente
    } catch (err) {
      toast.dismiss();
      toast.error(`Error al guardar las vinculaciones: ${err instanceof Error ? err.message : "Error desconocido"}`);
      console.error(err);
    }
  };

  const agregarCampo = () => {
    setNuevo({
      ...nuevo,
      campos: [...nuevo.campos, { nombre_campo: "", tipo_campo: "" }],
    });
  };

  const actualizarCampo = (index: number, key: keyof Campo, value: string) => {
    const nuevosCampos = [...nuevo.campos];
    (nuevosCampos[index][key] as string) = value;
    setNuevo({ ...nuevo, campos: nuevosCampos });
  };

  const eliminarCampo = (index: number) => {
    const nuevosCampos = nuevo.campos.filter((_, i) => i !== index);
    setNuevo({ ...nuevo, campos: nuevosCampos });
  };

  const agregarSensor = async () => {
    try {
      // Validación básica
      if (!nuevo.sensor.trim() || !nuevo.tipo_sensor.trim()) {
        toast.error("Por favor completa el nombre y tipo del sensor");
        return;
      }

      const camposValidos = nuevo.campos.filter(
        campo => campo.nombre_campo.trim() && campo.tipo_campo.trim()
      );

      if (camposValidos.length === 0) {
        toast.error("Agrega al menos un campo válido");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/agregar_sensor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevo,
          campos: camposValidos
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setNuevo({
        sensor: "",
        tipo_sensor: "",
        activo: true,
        campos: [{ nombre_campo: "", tipo_campo: "" }],
      });
      toast.success(result.mensaje || "Sensor agregado correctamente");
      cargarDatos();
    } catch (err) {
      console.error("Error agregando sensor:", err);
      toast.error("Error al agregar el sensor. Verifica la conexión con el servidor.");
    }
  };

  const guardarEdicion = async () => {
    if (!editando) return;
    
    try {
      // Validación básica
      if (!editando.sensor.trim() || !editando.tipo_sensor.trim()) {
        toast.error("Por favor completa el nombre y tipo del sensor");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/editar_sensor/${editando.sensor_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editando,
          activo: Boolean(editando.activo),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setEditando(null);
      setIsEditDialogOpen(false);
      toast.success(result.mensaje || "Sensor actualizado correctamente");
      cargarDatos();
    } catch (err) {
      console.error("Error editando sensor:", err);
      toast.error("Error al actualizar el sensor. Verifica la conexión con el servidor.");
    }
  };

  const eliminarSensor = async (sensor_id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este sensor y todas sus medidas? Esta acción no se puede deshacer.")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/eliminar_sensor_definitivo/${sensor_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(result.mensaje || "Sensor eliminado correctamente");
      cargarDatos();
    } catch (err) {
      console.error("Error eliminando sensor:", err);
      toast.error("No se pudo eliminar el sensor. Verifica la conexión con el servidor.");
    }
  };

  const tiposCampo = ["integer", "float", "string", "boolean"];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Lista de Sensores
          </TabsTrigger>
          <TabsTrigger value="vincular" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Vincular Sensores
          </TabsTrigger>
          <TabsTrigger value="medidas" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Últimas Medidas
          </TabsTrigger>
          <TabsTrigger value="calificaciones" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Calificaciones
          </TabsTrigger>
          <TabsTrigger value="agregar" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Sensor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Lista de Sensores ({sensores.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sensores.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Campos</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sensores.map((sensor) => (
                        <TableRow key={sensor.sensor_id}>
                          <TableCell className="font-medium">{sensor.sensor}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{sensor.tipo_sensor}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {sensor.activo ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{sensor.activo ? "Activo" : "Inactivo"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {sensor.campos.map((campo, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {campo.nombre_campo} <span className="text-muted-foreground ml-1">({campo.tipo_campo})</span>
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditando(sensor);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-500 hover:text-orange-600"
                                onClick={() => {
                                  // Aquí podría ir lógica para mostrar más información
                                  toast.info(`Sensor: ${sensor.sensor} (${sensor.tipo_sensor})`);
                                }}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => sensor.sensor_id && eliminarSensor(sensor.sensor_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay sensores registrados. Agrega uno desde la pestaña "Agregar Sensor"
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vincular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Vincular Sensores a Dispositivos
                </div>
                <Button onClick={guardarVinculaciones}>
                  Guardar Cambios
                </Button>
              </CardTitle>
               <p className="text-sm text-muted-foreground">
                Asigna cada sensor a un dispositivo. Solo se permite un dispositivo por sensor.
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Cargando dispositivos y sensores...
                </div>
              ) : dispositivos.length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay dispositivos registrados para vincular. Agrega un dispositivo primero.
                  </AlertDescription>
                </Alert>
              ) : sensores.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay sensores registrados para vincular.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Sensor</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Dispositivo asignado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sensores.map((sensor) => {
                        const vincActual = vinculaciones[sensor.sensor_id!] || null;
                        const dispositivoActual = dispositivos.find(d => d._id === vincActual || sensor.dispositivo_id === d._id);
                        const indiceDispositivo = dispositivoActual ? dispositivos.findIndex(d => d._id === dispositivoActual._id) : -1;

                        let nombreDispositivo = "";

                        if (indiceDispositivo === 3) {
                          // Dispositivo físico 4: AtmoSmart (forzado)
                          nombreDispositivo = "AtmoSmart";
                        } else if (indiceDispositivo === 0) {
                          // Dispositivo físico 1: TerraSmart (para análisis general)
                          nombreDispositivo = dispositivoActual?.nombre || "Dispositivo 1 (TerraSmart)";
                        } else if (indiceDispositivo === 1) {
                          // Dispositivo físico 2: TerraSmart (para análisis general)
                          nombreDispositivo = dispositivoActual?.nombre || "Dispositivo 2 (TerraSmart)";
                        } else if (indiceDispositivo === 2) {
                          // Dispositivo físico 3: AireSmart (vista dedicada)
                          nombreDispositivo = dispositivoActual?.nombre || "AireSmart";
                        } else if (indiceDispositivo >= 0) {
                          // Cualquier otro dispositivo de suelo adicional
                          nombreDispositivo = dispositivoActual?.nombre || `Dispositivo Tierra ${indiceDispositivo + 1}`;
                        }

                        return (
                          <TableRow key={sensor.sensor_id}>
                            <TableCell className="font-medium">{sensor.sensor}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium border ${
                                  vincActual
                                    ? 'bg-accent text-accent-foreground border-accent'
                                    : 'bg-muted text-muted-foreground border-muted'
                                }`}
                              >
                                {vincActual
                                  ? `Conectado a ${nombreDispositivo}`
                                  : 'No conectado a ningún dispositivo'}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Select
                                value={vincActual || "null"}
                                onValueChange={(value) =>
                                  handleVinculacionChange(
                                    sensor.sensor_id!,
                                    value === "null" ? null : value
                                  )
                                }
                              >
                                <SelectTrigger className="w-56 mx-auto">
                                  <SelectValue placeholder="Selecciona un dispositivo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="null">Sin vincular</SelectItem>
                                  {dispositivos.map((dispositivo, index) => {
                                    let label: string;

                                    if (index === 3) {
                                      // Dispositivo físico 4: AtmoSmart (forzado)
                                      label = 'AtmoSmart';
                                    } else if (index === 0) {
                                      // Dispositivo físico 1: TerraSmart (para análisis general)
                                      label = dispositivo.nombre || 'Dispositivo 1 (TerraSmart)';
                                    } else if (index === 1) {
                                      // Dispositivo físico 2: TerraSmart (para análisis general)
                                      label = dispositivo.nombre || 'Dispositivo 2 (TerraSmart)';
                                    } else if (index === 2) {
                                      // Dispositivo físico 3: AireSmart (vista dedicada)
                                      label = dispositivo.nombre || 'AireSmart';
                                    } else {
                                      // Cualquier otro dispositivo de suelo adicional
                                      label = dispositivo.nombre || `Dispositivo Tierra ${index + 1}`;
                                    }

                                    return (
                                      <SelectItem key={dispositivo._id} value={dispositivo._id}>
                                        {label}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medidas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Últimas Medidas ({medidas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medidas.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sensor</TableHead>
                        <TableHead>Campo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medidas.map((medida, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{medida.sensor}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{medida.nombre_campo}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {typeof medida.valor === 'boolean' ? (medida.valor ? 'true' : 'false') : medida.valor}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(medida.timestamp).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay medidas registradas en este momento
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calificaciones" className="space-y-4">
          <Calificaciones />
        </TabsContent>

        <TabsContent value="agregar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Agregar Nuevo Sensor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sensor-name">Nombre del Sensor</Label>
                  <Input
                    id="sensor-name"
                    placeholder="Ej: Sensor Humedad Campo 1"
                    value={nuevo.sensor}
                    onChange={(e) => setNuevo({ ...nuevo, sensor: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sensor-type">Tipo de Sensor</Label>
                  <Input
                    id="sensor-type"
                    placeholder="Ej: DHT22, pH_Meter"
                    value={nuevo.tipo_sensor}
                    onChange={(e) => setNuevo({ ...nuevo, tipo_sensor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sensor-status">Estado</Label>
                <Select
                  value={nuevo.activo ? "true" : "false"}
                  onValueChange={(value) =>
                    setNuevo({ ...nuevo, activo: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Campos del Sensor</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarCampo}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Campo
                  </Button>
                </div>
                
                {nuevo.campos.map((campo, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Nombre Campo</Label>
                      <Input
                        placeholder="Ej: humedad_suelo"
                        value={campo.nombre_campo}
                        onChange={(e) =>
                          actualizarCampo(index, "nombre_campo", e.target.value)
                        }
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <Label>Tipo Campo</Label>
                      <Select
                        value={campo.tipo_campo}
                        onValueChange={(value) =>
                          actualizarCampo(index, "tipo_campo", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposCampo.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {nuevo.campos.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => eliminarCampo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={agregarSensor} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Guardar Sensor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Sensor
            </DialogTitle>
          </DialogHeader>
          
          {editando && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Sensor</Label>
                  <Input
                    value={editando.sensor}
                    onChange={(e) =>
                      setEditando({ ...editando, sensor: e.target.value })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Sensor</Label>
                  <Input
                    value={editando.tipo_sensor}
                    onChange={(e) =>
                      setEditando({ ...editando, tipo_sensor: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={editando.activo ? "true" : "false"}
                  onValueChange={(value) =>
                    setEditando({ ...editando, activo: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <Label>Campos del Sensor</Label>
                {editando.campos.map((campo, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Nombre Campo"
                        value={campo.nombre_campo}
                        onChange={(e) => {
                          const nuevos = [...editando.campos];
                          nuevos[index].nombre_campo = e.target.value;
                          setEditando({ ...editando, campos: nuevos });
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <Select
                        value={campo.tipo_campo}
                        onValueChange={(value) => {
                          const nuevos = [...editando.campos];
                          nuevos[index].tipo_campo = value;
                          setEditando({ ...editando, campos: nuevos });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposCampo.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={guardarEdicion}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Vinculación (YA NO SE USA, SE PUEDE BORRAR) */}
      {/* <Dialog open={isVinculandoDialogOpen} onOpenChange={setIsVinculandoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular {vincularSensor?.sensor} a un dispositivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Selecciona un dispositivo de la lista para vincularlo con este sensor.</p>
            <Select onValueChange={(value) => {
              if (vincularSensor?.sensor_id) {
                guardarVinculacion(vincularSensor.sensor_id, value);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar dispositivo" />
              </SelectTrigger>
              <SelectContent>
                {dispositivos.map((dispositivo) => (
                  <SelectItem key={dispositivo._id} value={dispositivo._id}>
                    {dispositivo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}