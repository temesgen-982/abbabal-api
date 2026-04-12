DROP TABLE IF EXISTS "Vote" CASCADE;
DROP TABLE IF EXISTS "ProverbStats" CASCADE;
DROP TABLE IF EXISTS "Interpretation" CASCADE;
DROP TABLE IF EXISTS "ApiKey" CASCADE;
DROP TABLE IF EXISTS "Proverb" CASCADE;

DROP TYPE IF EXISTS "interpretation_type";
DROP TYPE IF EXISTS "interpretation_source";
DROP TYPE IF EXISTS "interpretation_language";

CREATE TYPE "interpretation_type" AS ENUM('translation', 'meaning');
CREATE TYPE "interpretation_source" AS ENUM('telegram', 'ai', 'user');
CREATE TYPE "interpretation_language" AS ENUM('en', 'am');

CREATE TABLE "Proverb" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"telegramMessageId" text NOT NULL,
	"telegramChannelId" text NOT NULL,
	"date" timestamp NOT NULL,
	"scrapedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Proverb_telegramMessageId_unique" UNIQUE("telegramMessageId")
);

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

CREATE TABLE "ProverbStats" (
	"id" serial PRIMARY KEY NOT NULL,
	"proverbId" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"forwards" integer DEFAULT 0 NOT NULL,
	"capturedAt" timestamp DEFAULT now() NOT NULL
);

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

CREATE TABLE "Vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"interpretationId" integer NOT NULL,
	"value" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vote_value_check" CHECK ("Vote"."value" in (-1, 1))
);

ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_proverbId_Proverb_id_fk" FOREIGN KEY ("proverbId") REFERENCES "public"."Proverb"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_createdBy_User_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "ProverbStats" ADD CONSTRAINT "ProverbStats_proverbId_Proverb_id_fk" FOREIGN KEY ("proverbId") REFERENCES "public"."Proverb"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_interpretationId_Interpretation_id_fk" FOREIGN KEY ("interpretationId") REFERENCES "public"."Interpretation"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX "proverb_text_idx" ON "Proverb" USING btree ("text");
CREATE INDEX "interpretation_proverb_idx" ON "Interpretation" USING btree ("proverbId");
CREATE INDEX "proverb_stats_idx" ON "ProverbStats" USING btree ("proverbId");
CREATE UNIQUE INDEX "vote_unique_idx" ON "Vote" USING btree ("userId","interpretationId");