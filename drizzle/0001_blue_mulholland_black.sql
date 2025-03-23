PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_summeries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoiceid` integer NOT NULL,
	`datum` text NOT NULL,
	`emoji` text NOT NULL,
	`titel` text NOT NULL,
	`beschreibung` text NOT NULL,
	`operation` text NOT NULL,
	`reasoning` text,
	`betrag` real NOT NULL,
	FOREIGN KEY (`invoiceid`) REFERENCES `invoice`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_summeries`("id", "invoiceid", "datum", "emoji", "titel", "beschreibung", "operation", "reasoning", "betrag") SELECT "id", "invoiceid", "datum", "emoji", "titel", "beschreibung", "operation", "reasoning", "betrag" FROM `summeries`;--> statement-breakpoint
DROP TABLE `summeries`;--> statement-breakpoint
ALTER TABLE `__new_summeries` RENAME TO `summeries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;