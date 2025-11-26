import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CropData {
  name: string;
  compatibility: number;
  season: string;
  growthTime: string;
  expectedYield: string;
  image: string;
}

interface CropRecommendationProps {
  crops: CropData[];
}

export function CropRecommendation({ crops }: CropRecommendationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌱 Recomendaciones de Cultivo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Basado en las condiciones actuales del suelo
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {crops.map((crop, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50">
            <ImageWithFallback
              src={crop.image}
              alt={crop.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{crop.name}</h4>
                <Badge variant={crop.compatibility > 80 ? "default" : "secondary"}>
                  {crop.compatibility}% Compatible
                </Badge>
              </div>
              
              <Progress value={crop.compatibility} className="h-2" />
              
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Temporada:</span> {crop.season}
                </div>
                <div>
                  <span className="font-medium">Crecimiento:</span> {crop.growthTime}
                </div>
                <div>
                  <span className="font-medium">Rendimiento:</span> {crop.expectedYield}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}