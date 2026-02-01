import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StatsResponse } from "@shared/routes";
import { 
  Activity, 
  Wind, 
  Thermometer, 
  Database 
} from "lucide-react";

interface StatsCardsProps {
  stats: StatsResponse;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: "Total Records",
      value: stats.totalCount,
      unit: "Units",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Avg Flowrate",
      value: stats.avgFlowrate.toFixed(2),
      unit: "m³/h",
      icon: Wind,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Avg Pressure",
      value: stats.avgPressure.toFixed(2),
      unit: "kPa",
      icon: Activity,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Avg Temperature",
      value: stats.avgTemperature.toFixed(2),
      unit: "°C",
      icon: Thermometer,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">
              {item.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {item.unit}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
