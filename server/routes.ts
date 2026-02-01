import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import multer from "multer";
import { parse } from "csv-parse/sync";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  app.get(api.datasets.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const datasets = await storage.getDatasets(req.user.id);
    res.json(datasets);
  });

  app.post(api.datasets.upload.path, upload.single("file"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      // Create Dataset Record
      const dataset = await storage.createDataset({
        userId: req.user.id,
        filename: req.file.originalname,
      });

      // Parse CSV
      const csvData = req.file.buffer.toString("utf-8");
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: true,
      });

      // Map to Equipment Insert Schema
      // Expected columns: Name, Type, Flowrate, Pressure, Temperature (case insensitive mapped)
      const equipmentList = records.map((record: any) => {
        // Simple normalization of keys to lowercase
        const normalize = (obj: any) => {
            const newObj: any = {};
            Object.keys(obj).forEach(key => {
                newObj[key.toLowerCase().trim()] = obj[key];
            });
            return newObj;
        };
        const r = normalize(record);

        return {
          datasetId: dataset.id,
          name: r.name || r["equipment name"] || "Unknown",
          type: r.type || "Unknown",
          flowrate: parseFloat(r.flowrate || 0),
          pressure: parseFloat(r.pressure || 0),
          temperature: parseFloat(r.temperature || 0),
        };
      });

      await storage.createEquipment(equipmentList);

      res.status(201).json(dataset);
    } catch (error) {
      console.error("CSV Parse Error:", error);
      res.status(500).json({ message: "Failed to parse CSV file" });
    }
  });

  app.get(api.datasets.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const dataset = await storage.getDataset(Number(req.params.id));
    if (!dataset) return res.sendStatus(404);
    if (dataset.userId !== req.user.id) return res.sendStatus(403);
    res.json(dataset);
  });

  app.get(api.datasets.equipment.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const dataset = await storage.getDataset(Number(req.params.id));
    if (!dataset) return res.sendStatus(404);
    if (dataset.userId !== req.user.id) return res.sendStatus(403);

    const items = await storage.getEquipment(dataset.id);
    res.json(items);
  });

  app.get(api.datasets.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const dataset = await storage.getDataset(Number(req.params.id));
    if (!dataset) return res.sendStatus(404);
    if (dataset.userId !== req.user.id) return res.sendStatus(403);

    const items = await storage.getEquipment(dataset.id);
    
    if (items.length === 0) {
      return res.json({
        totalCount: 0,
        avgFlowrate: 0,
        avgPressure: 0,
        avgTemperature: 0,
        typeDistribution: {},
      });
    }

    const totalCount = items.length;
    const avgFlowrate = items.reduce((acc, item) => acc + item.flowrate, 0) / totalCount;
    const avgPressure = items.reduce((acc, item) => acc + item.pressure, 0) / totalCount;
    const avgTemperature = items.reduce((acc, item) => acc + item.temperature, 0) / totalCount;

    const typeDistribution: Record<string, number> = {};
    items.forEach(item => {
      typeDistribution[item.type] = (typeDistribution[item.type] || 0) + 1;
    });

    res.json({
      totalCount,
      avgFlowrate,
      avgPressure,
      avgTemperature,
      typeDistribution,
    });
  });

  return httpServer;
}
