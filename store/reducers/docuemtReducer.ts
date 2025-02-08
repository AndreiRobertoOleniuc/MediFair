import { Document, ScanResponse } from "./../../models/Document";
// store/reducers/exampleReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DemoData from "@/assets/data/sampleInvoice2.json";
// Define a type for the slice state
interface DocumentState {
  documents: Document[];
}

// Define the initial state using that type
const initialState: DocumentState = {
  documents: [
    {
      id: "0",
      name: "Rechung von 20.05.2017",
      documemtImages: [
        /* capturedPhoto */
      ],
      scanResponse: JSON.parse(JSON.stringify(DemoData)) as ScanResponse,
    },
    {
      id: "1",
      name: "Rechung von 21.11.2017",
      documemtImages: [
        /* capturedPhoto */
      ],
      scanResponse: JSON.parse(JSON.stringify(DemoData)) as ScanResponse,
    },
  ],
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
