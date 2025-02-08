import { Document, ScanResponse } from "./../../models/Document";
// store/reducers/exampleReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DemoData1 from "@/assets/data/sampleInvoiceV2.1.json";
import DemoData2 from "@/assets/data/sampleInvoiceV2.2.json";

// Define a type for the slice state
interface DocumentState {
  documents: Document[];
}

const demoData1 = JSON.parse(JSON.stringify(DemoData1)) as ScanResponse;
const demoData2 = JSON.parse(JSON.stringify(DemoData2)) as ScanResponse;

// Define the initial state using that type
const initialState: DocumentState = {
  documents: [
    {
      id: "0",
      name: demoData1.overallSummary.titel,
      documemtImages: [
        /* capturedPhoto */
      ],
      scanResponse: demoData1,
    },
    {
      id: "1",
      name: demoData2.overallSummary.titel,
      documemtImages: [
        /* capturedPhoto */
      ],
      scanResponse: demoData2,
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
