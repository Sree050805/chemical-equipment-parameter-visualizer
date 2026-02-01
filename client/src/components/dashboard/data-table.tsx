import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Equipment } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: Equipment[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Card className="mt-6 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Raw Equipment Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Equipment Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Flowrate (m³/h)</TableHead>
                  <TableHead className="text-right">Pressure (kPa)</TableHead>
                  <TableHead className="text-right">Temp (°C)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {item.flowrate.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {item.pressure.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {item.temperature.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
