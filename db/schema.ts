import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

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
  invoiceid: integer("invoiceid")
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


// Invoice to Summeries (one-to-many)
export const invoiceRelations = relations(invoice, ({ many }) => ({
  summeries: many(summeries),
}));

// Summeries to Junction (one-to-many)
export const summeriesRelations = relations(summeries, ({ many }) => ({
  summeriesToPositions: many(summeriesToPositions),
}));

// Junction to Summeries and InvoicePositions (each is a one-to-one relation in the junction)
export const summeriesToPositionsRelations = relations(summeriesToPositions, ({ one }) => ({
  // Link back to summeries
  summeries: one(summeries, {
    fields: [summeriesToPositions.summeries_id],
    references: [summeries.id],
  }),
  // Link to invoicePositions
  invoicePositions: one(invoicePositions, {
    fields: [summeriesToPositions.invoicePositions_id],
    references: [invoicePositions.id],
  }),
}));

export type Invoice = typeof invoice.$inferSelect;
export type InvoicePositions = typeof invoicePositions.$inferSelect;
export type Summeries = typeof summeries.$inferSelect;
export type SummeriesToPositions = typeof summeriesToPositions.$inferSelect;
