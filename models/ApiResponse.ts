export interface ApiResponse {
  original: Positions[];
  analysis: number[][];
  summaries: SummaryItem[];
  overallSummary: OverallSummary;
  classification: Classification;
}
export interface Positions {
  anzahl: number;
  betrag: number;
  datum: string; // ISO date string or you could use Date if you parse it
  titel: string;
  tarifziffer: string;
  tarif: string;
  beschreibung: string;
  interpretation: string;
  bezugsziffer?: string; // Optional field since it does not appear in every item
}

export interface SummaryItem {
  datum: string;
  emoji: string;
  titel: string;
  beschreibung: string;
  reasoning?: string;
  relevant_ids: number[];
  betrag: number;
}

export interface OverallSummary {
  datum: string; // Date formatted as "DD.MM.YYYY"
  titel: string;
  gesamtbetrag: number;
}

export interface Classification {
  classification: string;
  language: string;
}

export interface Explanation {
  titel: string;
  erklärung: string;
}
