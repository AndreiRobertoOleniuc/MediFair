import { RootState } from "../store";

export const selectDocumentById = (id: string) => (state: RootState) =>
  state.document.documents.find((document) => document.id === id);
