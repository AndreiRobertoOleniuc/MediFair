import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";

export const DATABASE_NAME = "tarmed-scanner-db";

export function getDrizzleDb() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb, { schema });
  return db;
}
