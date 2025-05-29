ALTER TABLE "polls" ADD COLUMN "participant_limit" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "polls" ADD COLUMN "access_code" varchar(6) NOT NULL;