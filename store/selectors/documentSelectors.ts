import { RootState } from "../store";

export const selectDocumentById = (id: number) => (state: RootState) =>
  state.document.documents.find((document) => document.id === id);
