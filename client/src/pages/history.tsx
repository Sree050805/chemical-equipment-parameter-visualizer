import { useDatasets } from "@/hooks/use-datasets";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileSpreadsheet, 
  ArrowRight, 
  CalendarDays,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { data: datasets, isLoading } = useDatasets();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload History</h2>
        <p className="text-muted-foreground mt-2">
          View and manage your previously analyzed datasets.
        </p>
      </div>

      <div className="grid gap-4">
        {datasets?.length === 0 ? (
          <Card className="border-dashed p-8 text-center bg-muted/20">
            <CardContent className="pt-6">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No history yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first dataset to see it here.
              </p>
              <Button onClick={() => setLocation("/")}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          datasets?.map((dataset) => (
            <Card 
              key={dataset.id} 
              className="group hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                    {dataset.filename}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {dataset.createdAt ? format(new Date(dataset.createdAt), "MMM d, yyyy") : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {dataset.createdAt ? format(new Date(dataset.createdAt), "h:mm a") : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono">
                    ID: #{dataset.id}
                  </Badge>
                  <Button asChild>
                    <Link href={`/?id=${dataset.id}`}>
                      View Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
