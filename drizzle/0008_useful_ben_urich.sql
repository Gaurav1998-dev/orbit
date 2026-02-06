ALTER TABLE "analysis" RENAME COLUMN "top_5_posts_analysis" TO "text";--> statement-breakpoint
ALTER TABLE "analysis" DROP COLUMN "bottom_5_posts_analysis";