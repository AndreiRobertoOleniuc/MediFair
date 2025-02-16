import { Document } from "../../models/Document";
// store/reducers/exampleReducer.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchDocuments, insertDocument } from "../asyncThunks/documentThunks";

// Define a type for the slice state
interface DocumentState {
  documents: Document[];
  status: string;
  error: string | undefined;
}

const initialState: DocumentState = {
  documents: [],
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
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(insertDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(insertDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })
      .addCase(insertDocument.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default documentSlice.reducer;
