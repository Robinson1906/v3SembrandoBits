import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  date: string;
  humidity: number;
  temperature: number;
  ph: number;
  nutrients: number;
}

interface HistoricalChartProps {
  data: ChartData[];
}

export function HistoricalChart({ data }: HistoricalChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📈 Datos Históricos</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Últimas 24h</SelectItem>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Humedad (%)"
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Temperatura (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="ph" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="pH"
              />
              <Line 
                type="monotone" 
                dataKey="nutrients" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Nutrientes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}