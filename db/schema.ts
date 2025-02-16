import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Main Document table
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  name: text("name"),
});

// Document Images table
export const documentImages = sqliteTable("document_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  uri: text("uri").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  exif: text("exif"),
});

// TarmedPositions table (original array in scanResponse)
export const tarmedPositions = sqliteTable("tarmed_positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  datum: text("datum").notNull(),
  tarif: text("tarif").notNull(),
  tarifziffer: text("tarifziffer").notNull(),
  bezugsziffer: text("bezugsziffer").notNull(),
  beschreibung: text("beschreibung").notNull(),
  anzahl: integer("anzahl").notNull(),
  betrag: real("betrag").notNull(),
});

// TarmedSummaries table without the inline relevant_ids column.
export const tarmedSummaries = sqliteTable("tarmed_summaries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  datum: text("datum").notNull(),
  emoji: text("emoji").notNull(),
  titel: text("titel").notNull(),
  beschreibung: text("beschreibung").notNull(),
  operation: text("operation").notNull(),
  reasoning: text("reasoning"),
  betrag: real("betrag").notNull(),
});

// New table for relevant IDs for each TarmedSummary.
export const tarmedSummaryRelevantIds = sqliteTable(
  "tarmed_summary_relevant_ids",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tarmedSummaryId: integer("tarmed_summary_id")
      .notNull()
      .references(() => tarmedSummaries.id),
    relevantId: integer("relevant_id").notNull(),
  }
);

// OverallSummary table (one-to-one relation with Document)
export const overallSummaries = sqliteTable("overall_summaries", {
  documentId: text("document_id")
    .primaryKey()
    .references(() => documents.id),
  datum: text("datum").notNull(),
  titel: text("titel").notNull(),
  gesamtbetrag: real("gesamtbetrag").notNull(),
});

// Relations
export const documentsRelations = relations(documents, ({ many, one }) => ({
  documentImages: many(documentImages),
  tarmedPositions: many(tarmedPositions),
  tarmedSummaries: many(tarmedSummaries),
  overallSummary: one(overallSummaries, {
    fields: [documents.id],
    references: [overallSummaries.documentId],
  }),
}));

export const documentImagesRelations = relations(documentImages, ({ one }) => ({
  document: one(documents, {
    fields: [documentImages.documentId],
    references: [documents.id],
  }),
}));

export const tarmedPositionsRelations = relations(
  tarmedPositions,
  ({ one }) => ({
    document: one(documents, {
      fields: [tarmedPositions.documentId],
      references: [documents.id],
    }),
  })
);

export const tarmedSummariesRelations = relations(
  tarmedSummaries,
  ({ one, many }) => ({
    document: one(documents, {
      fields: [tarmedSummaries.documentId],
      references: [documents.id],
    }),
    // New relation for relevant IDs.
    relevantIds: many(tarmedSummaryRelevantIds),
  })
);

export const tarmedSummaryRelevantIdsRelations = relations(
  tarmedSummaryRelevantIds,
  ({ one }) => ({
    tarmedSummary: one(tarmedSummaries, {
      fields: [tarmedSummaryRelevantIds.tarmedSummaryId],
      references: [tarmedSummaries.id],
    }),
  })
);

export const overallSummariesRelations = relations(
  overallSummaries,
  ({ one }) => ({
    document: one(documents, {
      fields: [overallSummaries.documentId],
      references: [documents.id],
    }),
  })
);

// Infer types (note: TarmedSummary type now expects a relevant_ids array)
export type Document = typeof documents.$inferSelect;
export type DocumentImage = typeof documentImages.$inferSelect;
export type TarmedPosition = typeof tarmedPositions.$inferSelect;
export type TarmedSummary = Omit<
  typeof tarmedSummaries.$inferSelect,
  "relevantIds"
> & { relevant_ids: number[] };
export type OverallSummary = typeof overallSummaries.$inferSelect;
