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
CREATE TABLE "Proverb" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"text" text NOT NULL,
	"views" integer NOT NULL,
	"forwards" integer NOT NULL,
	"englishTranslation" text,
	"amharicMeaning" text,
	"englishMeaning" text,
	"translationSource" text,
	"meaningSource" text,
	"confidence" real DEFAULT 0 NOT NULL,
	"needsReview" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
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
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Proverb_text_idx" ON "Proverb" USING btree ("text");