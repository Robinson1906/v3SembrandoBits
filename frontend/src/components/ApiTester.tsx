import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Send,
  Server,
  CheckCircle,
  Database
} from "lucide-react";
import { toast } from "sonner";

export function ApiTester() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  
  const API_BASE_URL = "http://200.91.211.22:8860";

  const checkServerStatus = async () => {
    setServerStatus("checking");
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (response.ok) {
        setServerStatus("online");
        const text = await response.text();
        setTestResult(`✅ Servidor funcionando: ${text}`);
      } else {
        setServerStatus("offline");
        setTestResult(`❌ Servidor respondió con error: ${response.status}`);
      }
    } catch (error) {
      setServerStatus("offline");
      setTestResult(`❌ Error de conexión: ${error}`);
    }
  };

  const testEndpoint = async (endpoint: string, method: string = "GET", body?: any) => {
    setIsLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();
      
      setTestResult(`✅ ${method} ${endpoint}\nStatus: ${response.status}\nRespuesta:\n${JSON.stringify(data, null, 2)}`);
      toast.success(`Prueba exitosa: ${method} ${endpoint}`);
    } catch (error) {
      setTestResult(`❌ Error en ${method} ${endpoint}:\n${error}`);
      toast.error(`Error en la prueba: ${method} ${endpoint}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestMeasurement = async () => {
    const testData = {
      measures: {
        "Sensor Test": [
          { value: 25.5, detail: "temperatura" },
          { value: 65.2, detail: "humedad_suelo" },
          { value: 6.8, detail: "ph_nivel" }
        ]
      }
    };

    await testEndpoint("/guardar", "POST", testData);
  };

  React.useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Probador de API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado del Servidor */}
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === "online" ? "bg-green-500" : 
                serverStatus === "offline" ? "bg-red-500" : "bg-yellow-500"
              }`} />
              <span className="font-medium">Estado del Servidor:</span>
              <Badge variant={serverStatus === "online" ? "default" : "destructive"}>
                {serverStatus === "online" ? "En línea" : 
                 serverStatus === "offline" ? "Desconectado" : "Verificando..."}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={checkServerStatus}>
              Verificar
            </Button>
          </div>

          {/* Botones de Prueba */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => testEndpoint("/")}
              disabled={isLoading}
              variant="outline"
            >
              <Send className="h-4 w-4 mr-2" />
              Test Home
            </Button>

            <Button
              onClick={() => testEndpoint("/listar_sensores_campos")}
              disabled={isLoading}
              variant="outline"
            >
              <Database className="h-4 w-4 mr-2" />
              Listar Sensores
            </Button>

            <Button
              onClick={() => testEndpoint("/medidas")}
              disabled={isLoading}
              variant="outline"
            >
              <Database className="h-4 w-4 mr-2" />
              Ver Medidas
            </Button>

            <Button
              onClick={sendTestMeasurement}
              disabled={isLoading}
              variant="outline"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Medida Test
            </Button>
          </div>

          {/* Resultado */}
          <div className="space-y-2">
            <Label>Resultado de la Prueba:</Label>
            <Textarea
              value={testResult}
              readOnly
              rows={10}
              className="font-mono text-sm"
              placeholder="Los resultados de las pruebas aparecerán aquí..."
            />
          </div>

          {/* Instrucciones */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Instrucciones:</strong>
              <br />• Asegúrate de que el servidor Flask esté ejecutándose en http://200.91.211.22:8860
              <br />• Usa "Test Home" para verificar la conexión básica
              <br />• "Enviar Medida Test" creará datos de ejemplo si hay sensores configurados
              <br />• Revisa los resultados en el área de texto para diagnóstico
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}