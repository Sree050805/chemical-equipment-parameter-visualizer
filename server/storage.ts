import { users, datasets, equipment, type User, type InsertUser, type Dataset, type InsertDataset, type Equipment, type InsertEquipment } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createDataset(dataset: InsertDataset): Promise<Dataset>;
  getDatasets(userId: number): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  
  createEquipment(equipmentList: InsertEquipment[]): Promise<Equipment[]>;
  getEquipment(datasetId: number): Promise<Equipment[]>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const [newDataset] = await db.insert(datasets).values(dataset).returning();
    return newDataset;
  }

  async getDatasets(userId: number): Promise<Dataset[]> {
    return db
      .select()
      .from(datasets)
      .where(eq(datasets.userId, userId))
      .orderBy(desc(datasets.createdAt))
      .limit(5);
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
    return dataset;
  }

  async createEquipment(equipmentList: InsertEquipment[]): Promise<Equipment[]> {
    if (equipmentList.length === 0) return [];
    return db.insert(equipment).values(equipmentList).returning();
  }

  async getEquipment(datasetId: number): Promise<Equipment[]> {
    return db.select().from(equipment).where(eq(equipment.datasetId, datasetId));
  }
}

export const storage = new DatabaseStorage();
