import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { type LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "danger";
  icon: LucideIcon;
  trend?: number;
  description?: string;
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  status, 
  icon: Icon, 
  trend,
  description 
}: SensorCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "good": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "danger": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "good": return "Óptimo";
      case "warning": return "Atención";
      case "danger": return "Crítico";
      default: return "Sin datos";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <Badge 
            variant={status === "good" ? "default" : status === "warning" ? "secondary" : "destructive"}
            className="text-xs"
          >
            {getStatusText()}
          </Badge>
          
          {trend !== undefined && (
            <div className={`text-xs flex items-center gap-1 ${
              trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"
            }`}>
              {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}