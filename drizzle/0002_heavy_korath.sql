CREATE TYPE "public"."analysis_stage" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TABLE "analysis" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"x_user_id" text NOT NULL,
	"top_5_posts_analysis" text,
	"bottom_5_posts_analysis" text,
	"top_5_post_ids" text,
	"bottom_5_post_ids" text,
	"analysis_stage" "analysis_stage",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_x_user_id_x_user_id_fk" FOREIGN KEY ("x_user_id") REFERENCES "public"."x_user"("id") ON DELETE cascade ON UPDATE no action;