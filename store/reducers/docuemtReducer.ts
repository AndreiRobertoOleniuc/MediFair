import { Document } from "./../../models/Document";
// store/reducers/exampleReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface DocumentState {
  documents: Document[];
}

// Define the initial state using that type
const initialState: DocumentState = {
  documents: [],
};

const documentSlice = createSlice({
  name: "documentSlice",
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },
  },
});

export const { addDocument } = documentSlice.actions;

export default documentSlice.reducer;
