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
import { ApiTester } from "./ApiTester";
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
  TestTube2
} from "lucide-react";
import { toast } from "sonner";

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
}

interface Medida {
  sensor: string;
  nombre_campo: string;
  valor: string | number;
  fecha: string;
}

export function SensorManagement() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [medidas, setMedidas] = useState<Medida[]>([]);
  const [nuevo, setNuevo] = useState<Sensor>({
    sensor: "",
    tipo_sensor: "",
    activo: true,
    campos: [{ nombre_campo: "", tipo_campo: "" }],
  });
  const [editando, setEditando] = useState<Sensor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:5000";

  const cargarSensores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/listar_sensores_campos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSensores(data);
    } catch (err) {
      console.error("Error cargando sensores:", err);
      toast.error("Error al cargar los sensores. Verifica que el servidor esté funcionando.");
      // Datos de fallback en caso de error
      setSensores([]);
    }
  };

  const cargarMedidas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medidas`);
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
    cargarSensores();
    cargarMedidas();
    const intervalo = setInterval(cargarMedidas, 5000); // 5 segundos como en el código original
    return () => clearInterval(intervalo);
  }, []);

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
      cargarSensores();
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
      cargarSensores();
    } catch (err) {
      console.error("Error editando sensor:", err);
      toast.error("Error al actualizar el sensor. Verifica la conexión con el servidor.");
    }
  };

  const eliminarSensor = async (sensor_id: number) => {
    if (!confirm("¿Seguro que deseas desactivar este sensor?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/eliminar_sensor/${sensor_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // El backend puede no devolver JSON, lo manejamos seguro
      try {
        const result = await response.json();
        toast.success(result.mensaje || "Sensor desactivado correctamente");
      } catch {
        toast.success("Sensor desactivado correctamente");
      }
      
      cargarSensores(); // Actualizamos la lista
    } catch (err) {
      console.error("Error eliminando sensor:", err);
      toast.error("No se pudo desactivar el sensor. Verifica la conexión con el servidor.");
    }
  };

  const tiposCampo = ["int", "float", "string", "boolean"];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Lista de Sensores
          </TabsTrigger>
          <TabsTrigger value="medidas" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Últimas Medidas
          </TabsTrigger>
          <TabsTrigger value="agregar" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar Sensor
          </TabsTrigger>
          <TabsTrigger value="pruebas" className="flex items-center gap-2">
            <TestTube2 className="h-4 w-4" />
            Pruebas API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Lista de Sensores Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
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
                      <TableCell className="font-medium">{sensor.sensor_id}</TableCell>
                      <TableCell>{sensor.sensor}</TableCell>
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
                          <span>{sensor.activo ? "Activo" : "Inactivo"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {sensor.campos.map((campo, index) => (
                            <div key={index} className="text-xs">
                              <Badge variant="secondary" className="mr-1">
                                {campo.nombre_campo}
                              </Badge>
                              <span className="text-muted-foreground">
                                ({campo.tipo_campo})
                              </span>
                            </div>
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
                            variant="destructive"
                            onClick={() => sensor.sensor_id && eliminarSensor(sensor.sensor_id)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medidas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Últimas Medidas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medidas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sensor</TableHead>
                      <TableHead>Campo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medidas.map((medida, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{medida.sensor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{medida.nombre_campo}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{medida.valor}</TableCell>
                        <TableCell className="text-muted-foreground">{medida.fecha}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

              <Button onClick={agregarSensor} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Guardar Sensor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pruebas" className="space-y-4">
          <ApiTester />
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
    </div>
  );
}