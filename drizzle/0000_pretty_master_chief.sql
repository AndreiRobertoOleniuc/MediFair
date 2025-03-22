CREATE TABLE `invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titel` text NOT NULL,
	`datum` text,
	`gesamtbetrag` real,
	`classification` text,
	`language` text
);
--> statement-breakpoint
CREATE TABLE `invoicePositions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datum` text NOT NULL,
	`tarif` text NOT NULL,
	`tarifziffer` text NOT NULL,
	`beschreibung` text NOT NULL,
	`anzahl` integer NOT NULL,
	`betrag` real NOT NULL,
	`titel` text NOT NULL,
	`interpretation` text
);
--> statement-breakpoint
CREATE TABLE `summeries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` integer NOT NULL,
	`datum` text NOT NULL,
	`emoji` text NOT NULL,
	`titel` text NOT NULL,
	`beschreibung` text NOT NULL,
	`operation` text NOT NULL,
	`reasoning` text,
	`betrag` real NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `invoice`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `summeriesToPositions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`summeries_id` integer NOT NULL,
	`invoicePositions_id` integer NOT NULL,
	FOREIGN KEY (`summeries_id`) REFERENCES `summeries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoicePositions_id`) REFERENCES `invoicePositions`(`id`) ON UPDATE no action ON DELETE no action
);
