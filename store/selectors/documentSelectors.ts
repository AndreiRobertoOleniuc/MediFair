import { RootState } from "../store";

export const selectDocumentById = (id: number) => (state: RootState) =>
  state.document.documents.find((document) => document.id === id);

export const selectTarmedPositionExplanation = (state: RootState) =>
  state.document.explanation;

export const selectDocumentStatus = (state: RootState) => state.document.status;
