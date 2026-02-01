import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type StatsResponse } from "@shared/routes";
import { type Dataset, type Equipment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// GET /api/datasets
export function useDatasets() {
  return useQuery({
    queryKey: [api.datasets.list.path],
    queryFn: async () => {
      const res = await fetch(api.datasets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch datasets");
      return api.datasets.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/datasets/:id
export function useDataset(id: number | null) {
  return useQuery({
    queryKey: [api.datasets.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.datasets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dataset");
      return api.datasets.get.responses[200].parse(await res.json());
    },
  });
}

// GET /api/datasets/:id/stats
export function useDatasetStats(id: number | null) {
  return useQuery({
    queryKey: [api.datasets.stats.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.datasets.stats.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.datasets.stats.responses[200].parse(await res.json());
    },
  });
}

// GET /api/datasets/:id/equipment
export function useDatasetEquipment(id: number | null) {
  return useQuery({
    queryKey: [api.datasets.equipment.path, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return [];
      const url = buildUrl(api.datasets.equipment.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch equipment");
      return api.datasets.equipment.responses[200].parse(await res.json());
    },
  });
}

// POST /api/datasets/upload
export function useUploadDataset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.datasets.upload.path, {
        method: api.datasets.upload.method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.datasets.upload.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to upload dataset");
      }
      return api.datasets.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] });
      toast({
        title: "Upload Successful",
        description: "Your dataset has been processed and is ready for analysis.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
