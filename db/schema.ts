import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Overall Summary Table
export const overAllSummary = sqliteTable("overAllSummary", {
  id: integer().primaryKey({ autoIncrement: true }),
  datum: text(),
  titel: text(),
  gesamtbetrag: real(),
});

// Scan Response Table
export const scanResponse = sqliteTable("scanResponse", {
  id: integer().primaryKey({ autoIncrement: true }),
  overAllSummaryId: integer()
    .notNull()
    .references(() => overAllSummary.id),
});

// Original Line Items Table
export const originalLineItems = sqliteTable("originalLineItems", {
  id: integer().primaryKey({ autoIncrement: true }),
  datum: text(),
  tarif: text(),
  tarifziffer: text(),
  bezugsziffer: text(),
  beschreibung: text(),
  anzahl: integer(),
  betrag: real(),
  scanResponseId: integer()
    .notNull()
    .references(() => scanResponse.id),
});

// Summeries Table (for TarmedSummary)
// Note: "relevant_ids" is now stored as text containing JSON.
export const summeries = sqliteTable("summeries", {
  id: integer().primaryKey({ autoIncrement: true }),
  datum: text(),
  emoji: text(),
  titel: text(),
  beschreibung: text(),
  operation: text(),
  relevant_ids: text(), // JSON-encoded array of numbers
  betrag: real(),
  scanResponseId: integer()
    .notNull()
    .references(() => scanResponse.id),
});

// Document Table
export const document = sqliteTable("document", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text(),
  scanResponseId: integer()
    .notNull()
    .references(() => scanResponse.id),
});

// Document Images Table
// Represents an array of CameraCapturedPicture for a Document.
export const documentImages = sqliteTable("documentImages", {
  id: integer().primaryKey({ autoIncrement: true }),
  documentId: integer()
    .notNull()
    .references(() => document.id),
  width: integer(),
  height: integer(),
  uri: text(),
  base64: text(), // Optional: Base64 representation if needed.
  exif: text(), // Optional: JSON-encoded EXIF data.
});

export type TableOverAllSummary = typeof overAllSummary.$inferSelect;
export type TableScanResponse = typeof scanResponse.$inferSelect;
export type TableOriginalLineItems = typeof originalLineItems.$inferSelect;
export type TableSummeries = typeof summeries.$inferSelect;
export type TableDocument = typeof document.$inferSelect;
export type TableDocumentImages = typeof documentImages.$inferSelect;
