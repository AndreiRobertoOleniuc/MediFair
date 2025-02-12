import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDrizzleDb } from "@/services/dbService";
import * as schema from "@/db/schema";

export const fetchDocuments = createAsyncThunk(
  "document/fetchDocuments",
  async () => {
    const db = getDrizzleDb();
    const documents = await db.select().from(schema.document).all();
    return documents;
  }
);
