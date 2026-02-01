import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { 
  useDatasets, 
  useDataset, 
  useDatasetStats, 
  useDatasetEquipment, 
  useUploadDataset 
} from "@/hooks/use-datasets";
import { FileUpload } from "@/components/dashboard/file-upload";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  AlertCircle, 
  ChevronRight, 
  Calendar,
  FileText
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const idParam = params.get("id");
  const datasetId = idParam ? parseInt(idParam) : null;

  const { data: datasets, isLoading: isLoadingList } = useDatasets();
  const uploadMutation = useUploadDataset();

  // If no ID provided but we have datasets, default to the most recent one
  useEffect(() => {
    if (!datasetId && datasets && datasets.length > 0) {
      // Sort by ID desc (newest first)
      const newest = [...datasets].sort((a, b) => b.id - a.id)[0];
      setLocation(`/?id=${newest.id}`);
    }
  }, [datasetId, datasets, setLocation]);

  // Fetch all data for selected dataset
  const { data: dataset, isLoading: isLoadingDataset } = useDataset(datasetId);
  const { data: stats, isLoading: isLoadingStats } = useDatasetStats(datasetId);
  const { data: equipment, isLoading: isLoadingEquipment } = useDatasetEquipment(datasetId);

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      setLocation(`/?id=${result.id}`);
    } catch (error) {
      // Error handled by hook toast
    }
  };

  // Loading State
  if (isLoadingList || (datasetId && (isLoadingDataset || isLoadingStats || isLoadingEquipment))) {
    return <DashboardSkeleton />;
  }

  // Empty State (No datasets uploaded yet)
  if (!isLoadingList && datasets?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Get Started</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Upload your first equipment parameter CSV to visualize and analyze your data.
          </p>
        </div>
        <FileUpload 
          onUpload={handleUpload} 
          isUploading={uploadMutation.isPending} 
        />
      </div>
    );
  }

  // Error State
  if (datasetId && !dataset) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load the requested dataset. It may have been deleted.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <FileText className="h-4 w-4" />
            <span className="font-medium">{dataset?.filename}</span>
            <span className="text-border mx-2">|</span>
            <Calendar className="h-4 w-4" />
            <span>
              {dataset?.createdAt ? format(new Date(dataset.createdAt), "PPP p") : ""}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            onClick={() => setLocation("/history")}
            className="hidden md:flex"
          >
            History
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="md:hidden">
            {/* Mobile upload button/trigger could go here */}
          </div>
        </div>
      </div>

      {/* Upload New Data (Collapsible or visible) */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Analyze New Dataset
        </h3>
        <FileUpload 
          onUpload={handleUpload} 
          isUploading={uploadMutation.isPending} 
        />
      </div>

      {/* Analytics Content */}
      {stats && equipment ? (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <StatsCards stats={stats} />
          <ChartsSection stats={stats} data={equipment} />
          <DataTable data={equipment} />
        </div>
      ) : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-3 h-[300px] rounded-xl" />
        <Skeleton className="col-span-4 h-[300px] rounded-xl" />
      </div>
    </div>
  );
}
