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
  beschreibung: string;
  operation: string;
  relevant_ids: number[];
  betrag: number;
}

export interface ScanResponse {
  original: {
    rechnungspositionen: TarmedPosition[];
  };
  summaries: TarmedSummary[];
}
