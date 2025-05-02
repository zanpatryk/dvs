CREATE TYPE "public"."status" AS ENUM('pending', 'resolved');--> statement-breakpoint
CREATE TABLE "polls_options" (
	"poll_id" numeric(78, 0) NOT NULL,
	"option" text NOT NULL,
	CONSTRAINT "polls_options_poll_id_option_pk" PRIMARY KEY("poll_id","option")
);
--> statement-breakpoint
CREATE TABLE "polls_participants" (
	"poll_id" numeric(78, 0) NOT NULL,
	"participant_address" varchar(42) NOT NULL,
	CONSTRAINT "polls_participants_poll_id_participant_address_pk" PRIMARY KEY("poll_id","participant_address")
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" numeric(78, 0) PRIMARY KEY NOT NULL,
	"creator_address" varchar(42) NOT NULL,
	"title" text NOT NULL,
	"desctiption" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issuer_address" varchar(42) NOT NULL,
	"status" "status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"response" text
);
--> statement-breakpoint
ALTER TABLE "polls_options" ADD CONSTRAINT "polls_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls_participants" ADD CONSTRAINT "polls_participants_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "poll_idx" ON "polls_options" USING btree ("poll_id");--> statement-breakpoint
CREATE INDEX "participant_idx" ON "polls_participants" USING btree ("participant_address");--> statement-breakpoint
CREATE INDEX "creator_idx" ON "polls" USING btree ("creator_address");