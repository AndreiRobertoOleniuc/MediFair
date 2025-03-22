import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const invoice = sqliteTable("invoice", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titel: text("titel").notNull(),
  datum: text("datum"),
  gesamtbetrag: real("gesamtbetrag"),
  classification: text("classification"),
  language: text("language"),
});

export const invoicePositions = sqliteTable("invoicePositions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  datum: text("datum").notNull(),
  tarif: text("tarif").notNull(),
  tarifziffer: text("tarifziffer").notNull(),
  beschreibung: text("beschreibung").notNull(),
  anzahl: integer("anzahl").notNull(),
  betrag: real("betrag").notNull(),
  titel: text("titel").notNull(),
  interpretation: text("interpretation"),
});

export const summeries = sqliteTable("summeries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id")
    .notNull()
    .references(() => invoice.id),
  datum: text("datum").notNull(),
  emoji: text("emoji").notNull(),
  titel: text("titel").notNull(),
  beschreibung: text("beschreibung").notNull(),
  operation: text("operation").notNull(),
  reasoning: text("reasoning"),
  betrag: real("betrag").notNull(),
});

// Table for relevant IDs for each TarmedSummary.
export const summeriesToPositions = sqliteTable("summeriesToPositions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  summeries_id: integer("summeries_id")
    .notNull()
    .references(() => summeries.id),
  invoicePositions_id: integer("invoicePositions_id")
    .notNull()
    .references(() => invoicePositions.id),
});

export type Invoice = typeof invoice.$inferSelect;
export type InvoicePositions = typeof invoicePositions.$inferSelect;
export type Summeries = typeof summeries.$inferSelect;
export type SummeriesToPositions = typeof summeriesToPositions.$inferSelect;
