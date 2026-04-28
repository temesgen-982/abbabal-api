ALTER TABLE "User" RENAME COLUMN "username" TO "email";--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_username_unique";--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "avatarUrl" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastLoginAt" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");