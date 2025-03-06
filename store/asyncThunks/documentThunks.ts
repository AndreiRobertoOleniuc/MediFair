import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Document,
  Explanation,
  ScanResponse,
  TarmedPosition,
} from "@/models/Document";
import { db } from "@/db/client";
import {
  documents,
  tarmedPositions,
  tarmedSummaries,
  overallSummaries,
  tarmedSummaryRelevantIds,
} from "~/db/schema";
import { findImageUri, loadScans, persistScannedImage } from "~/services/file";
import { documentApi } from "@/services/api";
import DemoData from "@/assets/data/sampleInvoiceV3.1.json";

export const analyzeDocument = createAsyncThunk<
  Document,
  string[],
  { rejectValue: string }
>("documents/analyze", async (photoUris, { rejectWithValue }) => {
  try {
    if (photoUris.length === 0) {
      return rejectWithValue("No photos provided");
    }

    // Get scan response from API (currently using demo data)
    await new Promise((resolve) => setTimeout(resolve, 40000));
    let response: ScanResponse = JSON.parse(JSON.stringify(DemoData));
    // Uncomment for real API:
    // let response: ScanResponse = await documentApi.analyseDocument(
    //   photoUris[0]
    // );

    // Construct document object
    const document: Document = {
      id: -1, // temporary id
      name: response.overallSummary.titel,
      imageUris: photoUris,
      scanResponse: response,
    };

    const persistedDoc = await persistDocumentToDb(document);
    return persistedDoc;
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
              titel: pos.titel,
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

    // Load the scanned images from the file system and add them to the documents.
    const scans = await loadScans();
    documentsFromDb.map((doc) => {
      doc.imageUris =
        findImageUri(doc.id!, doc.name ?? "document", scans ?? []) ?? [];
      return doc;
    });

    return documentsFromDb;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const explainPosition = createAsyncThunk<
  Explanation,
  TarmedPosition,
  { rejectValue: string }
>(
  "documents/explainPosition",
  async (position: TarmedPosition, { rejectWithValue }) => {
    try {
      // Simulate a server request with a delay.
      const response = await documentApi.fetchExplainPosition(position);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Extracted function to handle database persistence
const persistDocumentToDb = async (doc: Document): Promise<Document> => {
  await db.transaction(async (tx) => {
    // Insert the main Document record.
    const [insertedDoc] = await tx
      .insert(documents)
      .values({
        name: doc.name,
      })
      .returning({ id: documents.id, name: documents.name });

    const newId = insertedDoc.id;
    doc.id = newId;

    // Perist all of the scanned images with Expo File System and update the imageUris.
    const persistedImageUris = await Promise.all(
      doc.imageUris.map(async (uri, index) => {
        return await persistScannedImage(
          uri,
          newId,
          index,
          doc.name ?? "document"
        );
      })
    );
    doc.imageUris = persistedImageUris;

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
          titel: pos.titel,
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
};
