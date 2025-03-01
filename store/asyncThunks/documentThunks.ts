import { createAsyncThunk } from "@reduxjs/toolkit";
import { Document } from "@/models/Document";
import { db } from "@/db/client";
import {
  documents,
  tarmedPositions,
  tarmedSummaries,
  overallSummaries,
  tarmedSummaryRelevantIds,
} from "~/db/schema";

export const insertDocument = createAsyncThunk<
  Document,
  Document,
  { rejectValue: string }
>("documents/insert", async (doc, { rejectWithValue }) => {
  try {
    //TODO: Persist the document image URIs to the filesystem

    //Transaction so the whole document is inserted or nothing.
    await db.transaction(async (tx) => {
      // Insert the main Document record.
      const [insertedDoc] = await tx
        .insert(documents)
        .values({
          name: doc.name,
        })
        .returning({ id: documents.id, name: documents.name });

      const newId = insertedDoc.id;

      if (doc.scanResponse) {
        // Insert each TarmedPosition record.
        for (const pos of doc.scanResponse.original) {
          await tx.insert(tarmedPositions).values({
            documentId: newId,
            datum: pos.datum,
            tarif: pos.tarif,
            tarifziffer: pos.tarifziffer,
            bezugsziffer: pos.bezugsziffer,
            beschreibung: pos.beschreibung,
            anzahl: pos.anzahl,
            betrag: pos.betrag,
          });
        }

        // Insert each TarmedSummary record and its associated relevant IDs.
        for (const sum of doc.scanResponse.summaries) {
          const insertedSummary = await tx
            .insert(tarmedSummaries)
            .values({
              documentId: newId,
              datum: sum.datum,
              emoji: sum.emoji,
              titel: sum.titel,
              beschreibung: sum.beschreibung,
              operation: sum.operation,
              reasoning: sum.reasoning,
              betrag: sum.betrag,
            })
            .returning({ id: tarmedSummaries.id });
          const summaryId = insertedSummary[0].id;

          for (const rid of sum.relevant_ids) {
            await tx.insert(tarmedSummaryRelevantIds).values({
              tarmedSummaryId: summaryId,
              relevantId: rid,
            });
          }
        }

        // Insert OverallSummary record.
        await tx.insert(overallSummaries).values({
          documentId: newId,
          datum: doc.scanResponse.overallSummary.datum,
          titel: doc.scanResponse.overallSummary.titel,
          gesamtbetrag: doc.scanResponse.overallSummary.gesamtbetrag,
        });
      }
    });

    return doc;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchDocuments = createAsyncThunk<
  Document[],
  void,
  { rejectValue: string }
>("documents/fetch", async (_, { rejectWithValue }) => {
  try {
    const rows = await db.query.documents.findMany({
      with: {
        tarmedPositions: true,
        tarmedSummaries: {
          with: {
            relevantIds: true,
          },
        },
        overallSummary: true,
      },
    });

    const documentsFromDb: Document[] = rows.map((row) => ({
      id: row.id,
      name: row.name ?? undefined,
      imageUris: [], // no images stored in the db now
      scanResponse: row.overallSummary
        ? {
            original: row.tarmedPositions.map((pos) => ({
              datum: pos.datum,
              tarif: pos.tarif,
              tarifziffer: pos.tarifziffer,
              bezugsziffer: pos.bezugsziffer ?? undefined,
              beschreibung: pos.beschreibung,
              anzahl: pos.anzahl,
              betrag: pos.betrag,
            })),
            summaries: row.tarmedSummaries.map((sum) => ({
              datum: sum.datum,
              emoji: sum.emoji,
              titel: sum.titel,
              beschreibung: sum.beschreibung,
              operation: sum.operation,
              reasoning: sum.reasoning === null ? undefined : sum.reasoning,
              relevant_ids: sum.relevantIds.map((rel) => rel.relevantId),
              betrag: sum.betrag,
            })),
            overallSummary: {
              datum: row.overallSummary.datum,
              titel: row.overallSummary.titel,
              gesamtbetrag: row.overallSummary.gesamtbetrag,
            },
          }
        : undefined,
    }));

    //TODO: load images from filesystem and add to the documents before returning

    return documentsFromDb;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
