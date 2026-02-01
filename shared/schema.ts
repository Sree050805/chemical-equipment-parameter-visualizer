import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  filename: text("filename").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  flowrate: doublePrecision("flowrate").notNull(),
  pressure: doublePrecision("pressure").notNull(),
  temperature: doublePrecision("temperature").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  createdAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
