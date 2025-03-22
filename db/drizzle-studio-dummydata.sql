-- 1. Invoice: One row insert into the invoice table.
INSERT INTO invoice (titel, datum, gesamtbetrag, classification, language)
VALUES 
  ('Augenuntersuchung', '21.01.2025', 306.98, 'patientenrechnung', 'D');

---------------------------------------------------

-- 2. Invoice Positions: One multi-row insert for all 12 positions.
INSERT INTO invoicePositions (datum, tarif, tarifziffer, beschreibung, anzahl, betrag, titel, interpretation)
VALUES 
  ('21.01.2025', '001', '00.0010', 'Konsultation, erste 5 Min. (Grundkonsultation)', 1, 16.93, 'Grundkonsultation', ''),
  ('21.01.2025', '001', '00.0020', '+ Konsultation bei Personen über 6 Jahren und unter 75 Jahren, jede weiteren 5 Min. (Konsultationszuschlag)', 1, 16.93, 'Zuschlag Konsultation', ''),
  ('21.01.2025', '001', '00.0030', 'Konsultation, letzte 5 Min. (Konsultationszuschlag)', 1, 8.47, 'Zuschlag Konsultation', ''),
  ('21.01.2025', '001', '08.0040', 'Refraktionsbestimmung, subjektiv, durch Facharzt, beidseitig', 1, 48.59, 'Refraktionsbestimmung', ''),
  ('21.01.2025', '001', '08.0140', 'Untersuchung mit dem Amslemetz, pro Seite', 1, 16.2, 'Amsler-Netz Untersuchung', ''),
  ('21.01.2025', '001', '08.0140', 'Untersuchung mit dem Amslermetz, pro Seite', 1, 16.2, 'Amsler-Netz Untersuchung', ''),
  ('21.01.2025', '001', '08.0220', 'Applanationstonometrie und stereoskopische Papillenbeurteilung, beidseitig', 1, 32.4, 'Applanationstonometrie', ''),
  ('21.01.2025', '001', '08.1110', 'Fundusaufnahmen, beidseitig', 1, 94.56, 'Fundusaufnahme', ''),
  ('21.01.2025', '001', '08.1230', 'Spaltlampenuntersuchung der vorderen Augenabschnitte, beidseitig', 1, 12.15, 'Spaltlampenuntersuchung', ''),
  ('21.01.2025', '001', '08.3010', 'Biomikroskopie des zentralen Fundus, beidseitig', 1, 20.25, 'Biomikroskopie', ''),
  ('21.01.2025', '001', '08.3020', '+ Zuschlag für eingehende Untersuchung der Fundusperipherie, pro Seite', 1, 12.15, 'Zuschlag Fundusperipherie Untersuchung', ''),
  ('21.01.2025', '001', '08.3020', 'Zuschlag für eingehende Untersuchung der Fundusperipherie, pro Seite', 1, 12.15, 'Zuschlag Fundusperipherie Untersuchung', '');

---------------------------------------------------

-- 3. Summaries: One multi-row insert for all 7 summaries.
INSERT INTO summeries (document_id, datum, emoji, titel, beschreibung, operation, reasoning, betrag)
VALUES 
  (1, '21.01.2025', '🧑‍⚕️', 'Konsultation', 'Die Konsultation dauerte insgesamt 15 Minuten.', '', 'Die Positionen 00.0010, 00.0020 und 00.0030 beschreiben zusammen eine 15-minütige Konsultation am 21.01.2025. Die Beträge werden zusammengefasst', 42.33),
  (1, '21.01.2025', '👁️', 'Refraktionsbestimmung', 'Subjektive Refraktionsbestimmung durch Facharzt, beidseitig.', '', '', 48.59),
  (1, '21.01.2025', '👁️', 'Amsler-Netz Untersuchung', 'Beidseitige Untersuchung mit dem Amsler-Netz.', '', 'Es handelt sich um eine beidseitige Untersuchung, daher fasse ich die zwei Positionen zusammen. Die Datumsangaben sind identisch, daher wird es nur einmal genannt. Die Anzahl wird addiert: 1 + 1 = 2', 32.4),
  (1, '21.01.2025', '👁️', 'Tonometrie Papillenbeurteilung', 'Applanationstonometrie und stereoskopische Papillenbeurteilung, beidseitig', '', 'Die Leistung beinhaltet die Applanationstonometrie und die stereoskopische Papillenbeurteilung beidseitig am 21.01.2025. Daher fasse ich die zusammenfassende Leistung zusammen.', 32.4),
  (1, '21.01.2025', '👁️', 'Fundusaufnahme', 'Beidseitige Fundusaufnahme.', '', 'Die Position beinhaltet die beidseitige Fundusaufnahme am 21.01.2025. Daher fasse ich diese zusammen.', 94.56),
  (1, '21.01.2025', '👁️', 'Spaltlampenuntersuchung', 'Beidseitige Spaltlampenuntersuchung der vorderen Augenabschnitte.', '', 'Die Leistung beinhaltet eine beidseitige Spaltlampenuntersuchung der vorderen Augenabschnitte. Die Tarifziffer 08.1230 deutet auf diese spezifische Untersuchung hin. Das Datum ist der 21.01.2025. Das Emoji Auge wurde gewählt, da es gut zur Untersuchung passt.', 12.15),
  (1, '21.01.2025', '👁️', 'Fundusuntersuchung', 'Eingehende beidseitige Untersuchung des zentralen Fundus und der Fundusperipherie.', '', 'Die Rechnungspositionen beschreiben die Biomikroskopie des zentralen Fundus beidseitig (08.3010) sowie Zuschläge für die Untersuchung der Fundusperipherie auf beiden Seiten (08.3020). Es handelt sich um eine umfassende Untersuchung des gesamten Fundus beider Augen..', 44.55);

---------------------------------------------------

-- 4. Summary-to-Positions Mapping: One multi-row insert for all mappings.
-- Here we assume the following mapping:
-- Summary 1 (ID 1): invoicePositions 1, 2, 3
-- Summary 2 (ID 2): invoicePositions 4
-- Summary 3 (ID 3): invoicePositions 5, 6
-- Summary 4 (ID 4): invoicePositions 7
-- Summary 5 (ID 5): invoicePositions 8
-- Summary 6 (ID 6): invoicePositions 9
-- Summary 7 (ID 7): invoicePositions 10, 11, 12
INSERT INTO summeriesToPositions (summeries_id, invoicePositions_id)
VALUES 
  (1, 1), (1, 2), (1, 3),
  (2, 4),
  (3, 5), (3, 6),
  (4, 7),
  (5, 8),
  (6, 9),
  (7, 10), (7, 11), (7, 12);
