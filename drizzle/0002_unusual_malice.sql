PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invoicePositions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datum` text NOT NULL,
	`tarif` text,
	`tarifziffer` text,
	`beschreibung` text,
	`anzahl` integer NOT NULL,
	`betrag` real NOT NULL,
	`titel` text NOT NULL,
	`interpretation` text
);
--> statement-breakpoint
INSERT INTO `__new_invoicePositions`("id", "datum", "tarif", "tarifziffer", "beschreibung", "anzahl", "betrag", "titel", "interpretation") SELECT "id", "datum", "tarif", "tarifziffer", "beschreibung", "anzahl", "betrag", "titel", "interpretation" FROM `invoicePositions`;--> statement-breakpoint
DROP TABLE `invoicePositions`;--> statement-breakpoint
ALTER TABLE `__new_invoicePositions` RENAME TO `invoicePositions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_summeries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceid` integer NOT NULL,
	`datum` text NOT NULL,
	`emoji` text,
	`titel` text,
	`beschreibung` text,
	`reasoning` text,
	`betrag` real NOT NULL,
	FOREIGN KEY (`invoiceid`) REFERENCES `invoice`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_summeries`("id", "invoiceid", "datum", "emoji", "titel", "beschreibung", "reasoning", "betrag") SELECT "id", "invoiceid", "datum", "emoji", "titel", "beschreibung", "reasoning", "betrag" FROM `summeries`;--> statement-breakpoint
DROP TABLE `summeries`;--> statement-breakpoint
ALTER TABLE `__new_summeries` RENAME TO `summeries`;