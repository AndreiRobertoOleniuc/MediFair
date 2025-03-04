import { Document, Explanation } from "../../models/Document";
// store/reducers/exampleReducer.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDocuments,
  insertDocument,
  explainPosition,
} from "../asyncThunks/documentThunks";

// Define a type for the slice state
interface DocumentState {
  documents: Document[];
  explanation: Explanation | undefined;
  status: string;
  error: string | undefined;
}

const initialState: DocumentState = {
  documents: [],
  explanation: undefined,
  status: "idle",
  error: undefined,
};

const documentSlice = createSlice({
  name: "documentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.documents = action.payload;
      })
      .addCase(insertDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(insertDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(insertDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(explainPosition.pending, (state) => {
        state.status = "loading";
      })
      .addCase(explainPosition.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(explainPosition.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.explanation = action.payload;
      });
  },
});

export default documentSlice.reducer;
