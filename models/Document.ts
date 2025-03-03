export interface Document {
  id: number;
  name?: string;
  imageUris: string[];
  scanResponse?: ScanResponse;
}

export interface ScanResponse {
  original: TarmedPosition[];
  summaries: TarmedSummary[];
  overallSummary: OverallSummary;
}

export interface TarmedPosition {
  datum: string;
  tarif: string;
  tarifziffer: string;
  bezugsziffer?: string;
  beschreibung: string;
  anzahl: number;
  betrag: number;
  titel: string;
}

export interface TarmedSummary {
  datum: string;
  emoji: string;
  titel: string;
  beschreibung: string;
  operation: string;
  reasoning?: string;
  relevant_ids: number[];
  betrag: number;
}

export interface OverallSummary {
  datum: string;
  titel: string;
  gesamtbetrag: number;
}
