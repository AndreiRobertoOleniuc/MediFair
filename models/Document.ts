import { CameraCapturedPicture } from "expo-camera";

export interface Document {
  id: string;
  name?: string;
  documemtImages: CameraCapturedPicture[];
  scanResponse?: ScanResponse;
}

export interface TarmedPosition {
  datum: string;
  tarif: string;
  tarifziffer: string;
  beschreibung: string;
  anzahl: number;
  betrag: number;
}

export interface TarmedSummary {
  datum: string;
  emoij: string;
  titel: string;
  beschreibung: string;
  operation: string;
  relevant_ids: number[];
  betrag: number;
}

export interface OverallSummary {
  datum: string;
  titel: string;
  gesamtbetrag: number;
}

export interface ScanResponse {
  original: TarmedPosition[];
  summaries: TarmedSummary[];
  overallSummary: OverallSummary;
}
