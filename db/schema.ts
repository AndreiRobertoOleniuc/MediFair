import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Main Document table
export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
});

// TarmedPositions table
export const tarmedPositions = sqliteTable("tarmed_positions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id),
  datum: text("datum").notNull(),
  tarif: text("tarif").notNull(),
  tarifziffer: text("tarifziffer").notNull(),
  bezugsziffer: text("bezugsziffer"),
  beschreibung: text("beschreibung").notNull(),
  anzahl: integer("anzahl").notNull(),
  betrag: real("betrag").notNull(),
  titel: text("titel").notNull(),
});

// TarmedSummaries table
export const tarmedSummaries = sqliteTable("tarmed_summaries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id")
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

// Table for relevant IDs for each TarmedSummary.
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

// OverallSummary table
export const overallSummaries = sqliteTable("overall_summaries", {
  documentId: integer("document_id")
    .primaryKey()
    .references(() => documents.id),
  datum: text("datum").notNull(),
  titel: text("titel").notNull(),
  gesamtbetrag: real("gesamtbetrag").notNull(),
});

// Relations: Remove the documentImages key
export const documentsRelations = relations(documents, ({ many, one }) => ({
  tarmedPositions: many(tarmedPositions),
  tarmedSummaries: many(tarmedSummaries),
  overallSummary: one(overallSummaries, {
    fields: [documents.id],
    references: [overallSummaries.documentId],
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
export type TarmedPosition = typeof tarmedPositions.$inferSelect;
export type TarmedSummary = Omit<
  typeof tarmedSummaries.$inferSelect,
  "relevantIds"
> & { relevant_ids: number[] };
export type OverallSummary = typeof overallSummaries.$inferSelect;
