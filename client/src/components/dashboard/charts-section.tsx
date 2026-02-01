import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StatsResponse, type Equipment } from "@shared/routes";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";

interface ChartsSectionProps {
  stats: StatsResponse;
  data: Equipment[];
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export function ChartsSection({ stats, data }: ChartsSectionProps) {
  // Process data for charts
  const typeData = Object.entries(stats.typeDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Scatter plot data (subset for performance if needed, but plotting all 100-200 points is fine)
  const scatterData = data.map(item => ({
    x: item.pressure,
    y: item.flowrate,
    z: item.temperature, // For tooltip
    type: item.type,
    name: item.name
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
      {/* Type Distribution Pie Chart */}
      <Card className="col-span-3 border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Equipment Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Flowrate vs Pressure Scatter Plot */}
      <Card className="col-span-4 border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Flowrate vs Pressure Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Pressure" 
                  unit="kPa" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Flowrate" 
                  unit="m³/h" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border p-3 rounded-lg shadow-lg text-sm">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-muted-foreground">{data.type}</p>
                          <div className="mt-2 space-y-1">
                            <p>Pressure: {data.x.toFixed(1)} kPa</p>
                            <p>Flowrate: {data.y.toFixed(1)} m³/h</p>
                            <p>Temp: {data.z.toFixed(1)} °C</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Equipment" data={scatterData} fill="hsl(var(--primary))" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
