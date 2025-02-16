import { createAsyncThunk } from "@reduxjs/toolkit";
import { Document } from "@/models/Document";
import { db } from "@/db/client";
import {
  documents,
  documentImages,
  tarmedPositions,
  tarmedSummaries,
  overallSummaries,
  tarmedSummaryRelevantIds,
} from "~/db/schema";

/**
 * insertDocument thunk
 *
 * Inserts a Document record into the SQLite database.
 * It also inserts related records:
 * - Each CameraCapturedPicture in documemtImages is inserted into document_images.
 * - If a scanResponse is provided, it inserts:
 *   - Each TarmedPosition record (original array)
 *   - Each TarmedSummary record (summaries array)
 *   - The OverallSummary record (one-to-one relation)
 */

export const insertDocument = createAsyncThunk<
  Document,
  Document,
  { rejectValue: string }
>("documents/insert", async (doc, { rejectWithValue }) => {
  try {
    // Insert the main Document record.
    await db.insert(documents).values({
      id: doc.id,
      name: doc.name,
    });

    // Insert document images.
    for (const image of doc.documemtImages) {
      await db.insert(documentImages).values({
        documentId: doc.id,
        uri: image.uri,
        width: image.width,
        height: image.height,
        exif: image.exif ? JSON.stringify(image.exif) : null,
      });
    }

    if (doc.scanResponse) {
      // Insert each TarmedPosition record.
      for (const pos of doc.scanResponse.original) {
        await db.insert(tarmedPositions).values({
          documentId: doc.id,
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
        // Insert the summary record and get its generated ID.
        const insertedSummary = await db
          .insert(tarmedSummaries)
          .values({
            documentId: doc.id,
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

        // For each relevant ID, insert a row in the new table.
        for (const rid of sum.relevant_ids) {
          await db.insert(tarmedSummaryRelevantIds).values({
            tarmedSummaryId: summaryId,
            relevantId: rid,
          });
        }
      }

      // Insert OverallSummary record.
      await db.insert(overallSummaries).values({
        documentId: doc.id,
        datum: doc.scanResponse.overallSummary.datum,
        titel: doc.scanResponse.overallSummary.titel,
        gesamtbetrag: doc.scanResponse.overallSummary.gesamtbetrag,
      });
    }

    // Return the inserted document to match your Redux store structure.
    return doc;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

/**
 * Fetch documents from SQLite and map the raw result to your Document interface.
 *
 * Note: We convert null values (e.g. in reasoning and relevant_ids) to undefined or default values,
 * so that the shape of the returned data matches your interfaces.
 */
export const fetchDocuments = createAsyncThunk<
  Document[],
  void,
  { rejectValue: string }
>("documents/fetch", async (_, { rejectWithValue }) => {
  try {
    // Fetch documents along with nested relations.
    const rows = await db.query.documents.findMany({
      with: {
        documentImages: true,
        tarmedPositions: true,
        tarmedSummaries: {
          with: {
            relevantIds: true, // Include the new relevant IDs relation.
          },
        },
        overallSummary: true,
      },
    });

    // Map the returned rows to match your Document interface.
    const documentsFromDb: Document[] = rows.map((row) => ({
      id: row.id,
      name: row.name ?? undefined,
      documemtImages: row.documentImages.map((img) => ({
        uri: img.uri,
        width: img.width,
        height: img.height,
        exif: img.exif ? JSON.parse(img.exif) : undefined,
      })),
      scanResponse: row.overallSummary
        ? {
            original: row.tarmedPositions,
            summaries: row.tarmedSummaries.map((sum) => ({
              datum: sum.datum,
              emoji: sum.emoji,
              titel: sum.titel,
              beschreibung: sum.beschreibung,
              operation: sum.operation,
              reasoning: sum.reasoning === null ? undefined : sum.reasoning,
              // Map the nested relevant IDs into a simple number array.
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

    return documentsFromDb;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
