import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SoilAnalysisProps {
  soilType: string;
  texture: string;
  fertility: "high" | "medium" | "low";
  organicMatter: number;
  phLevel: number;
  recommendations: string[];
  image: string;
}

export function SoilAnalysis({ 
  soilType, 
  texture, 
  fertility, 
  organicMatter, 
  phLevel, 
  recommendations,
  image 
}: SoilAnalysisProps) {
  const getFertilityColor = () => {
    switch (fertility) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
    }
  };

  const getFertilityText = () => {
    switch (fertility) {
      case "high": return "Alta";
      case "medium": return "Media";
      case "low": return "Baja";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Análisis de Suelo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="composicion">Composición</TabsTrigger>
            <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={image}
                alt="Análisis de suelo"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tipo de Suelo:</span>
                  <Badge variant="outline">{soilType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Textura:</span>
                  <span className="text-sm text-muted-foreground">{texture}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Fertilidad:</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getFertilityColor()}`} />
                    <span className="text-sm">{getFertilityText()}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="composicion" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-accent/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Materia Orgánica</div>
                <div className="text-lg font-semibold">{organicMatter}%</div>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Nivel de pH</div>
                <div className="text-lg font-semibold">{phLevel}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Interpretación:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• pH {phLevel < 6.5 ? "ácido" : phLevel > 7.5 ? "alcalino" : "neutro"} 
                  {phLevel < 6.5 ? " - puede requerir encalado" : phLevel > 7.5 ? " - puede requerir acidificación" : " - ideal para la mayoría de cultivos"}
                </div>
                <div>• Materia orgánica {organicMatter < 3 ? "baja" : organicMatter > 5 ? "alta" : "adecuada"}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recomendaciones" className="space-y-4">
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}