CREATE TABLE `document` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`scanResponseId` integer NOT NULL,
	FOREIGN KEY (`scanResponseId`) REFERENCES `scanResponse`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documentImages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`documentId` integer NOT NULL,
	`width` integer,
	`height` integer,
	`uri` text,
	`base64` text,
	`exif` text,
	FOREIGN KEY (`documentId`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `originalLineItems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datum` text,
	`tarif` text,
	`tarifziffer` text,
	`bezugsziffer` text,
	`beschreibung` text,
	`anzahl` integer,
	`betrag` real,
	`scanResponseId` integer NOT NULL,
	FOREIGN KEY (`scanResponseId`) REFERENCES `scanResponse`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `overAllSummary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datum` text,
	`titel` text,
	`gesamtbetrag` real
);
--> statement-breakpoint
CREATE TABLE `scanResponse` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`overAllSummaryId` integer NOT NULL,
	FOREIGN KEY (`overAllSummaryId`) REFERENCES `overAllSummary`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `summeries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`datum` text,
	`emoji` text,
	`titel` text,
	`beschreibung` text,
	`operation` text,
	`relevant_ids` text,
	`betrag` real,
	`scanResponseId` integer NOT NULL,
	FOREIGN KEY (`scanResponseId`) REFERENCES `scanResponse`(`id`) ON UPDATE no action ON DELETE no action
);
