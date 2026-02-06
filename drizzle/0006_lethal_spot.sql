CREATE TYPE "public"."rank" AS ENUM('top_5', 'bottom_5', 'middle');--> statement-breakpoint
ALTER TABLE "analysis_x_post" ADD COLUMN "rank" "rank" NOT NULL;