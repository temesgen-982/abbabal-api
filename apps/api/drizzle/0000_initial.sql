CREATE TYPE "public"."interpretation_language" AS ENUM('en', 'am');--> statement-breakpoint
CREATE TYPE "public"."interpretation_source" AS ENUM('telegram', 'ai', 'user');--> statement-breakpoint
CREATE TYPE "public"."interpretation_type" AS ENUM('translation', 'meaning');--> statement-breakpoint
CREATE TYPE "public"."proverb_source" AS ENUM('telegram', 'user', 'admin_import');--> statement-breakpoint
CREATE TYPE "public"."proverb_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "ApiKey" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastUsedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "ApiKey_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "Interpretation" (
	"id" serial PRIMARY KEY NOT NULL,
	"proverbId" integer NOT NULL,
	"type" "interpretation_type" NOT NULL,
	"language" "interpretation_language" NOT NULL,
	"content" text NOT NULL,
	"source" "interpretation_source" NOT NULL,
	"model" text,
	"confidence" real DEFAULT 0,
	"isApproved" boolean DEFAULT false NOT NULL,
	"needsReview" boolean DEFAULT true NOT NULL,
	"createdBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProverbStats" (
	"id" serial PRIMARY KEY NOT NULL,
	"proverbId" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"forwards" integer DEFAULT 0 NOT NULL,
	"capturedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Proverb" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"source" "proverb_source" DEFAULT 'telegram' NOT NULL,
	"status" "proverb_status" DEFAULT 'approved' NOT NULL,
	"telegramMessageId" text,
	"createdBy" integer,
	"date" timestamp NOT NULL,
	"scrapedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "proverb_source_telegram_check" CHECK ((
      ("Proverb"."source" = 'telegram' and "Proverb"."telegramMessageId" is not null)
      or
      ("Proverb"."source" <> 'telegram' and "Proverb"."telegramMessageId" is null)
    ))
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "Vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"interpretationId" integer NOT NULL,
	"value" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vote_value_check" CHECK ("Vote"."value" in (-1, 1))
);
--> statement-breakpoint
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_proverbId_Proverb_id_fk" FOREIGN KEY ("proverbId") REFERENCES "public"."Proverb"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProverbStats" ADD CONSTRAINT "ProverbStats_proverbId_Proverb_id_fk" FOREIGN KEY ("proverbId") REFERENCES "public"."Proverb"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Proverb" ADD CONSTRAINT "Proverb_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_interpretationId_Interpretation_id_fk" FOREIGN KEY ("interpretationId") REFERENCES "public"."Interpretation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interpretation_proverb_idx" ON "Interpretation" USING btree ("proverbId");--> statement-breakpoint
CREATE INDEX "proverb_stats_idx" ON "ProverbStats" USING btree ("proverbId");--> statement-breakpoint
CREATE INDEX "proverb_text_idx" ON "Proverb" USING btree ("text");--> statement-breakpoint
CREATE INDEX "proverb_source_status_idx" ON "Proverb" USING btree ("source","status");--> statement-breakpoint
CREATE UNIQUE INDEX "proverb_telegram_unique_idx" ON "Proverb" USING btree ("telegramMessageId") WHERE "Proverb"."source" = 'telegram';--> statement-breakpoint
CREATE UNIQUE INDEX "vote_unique_idx" ON "Vote" USING btree ("userId","interpretationId");