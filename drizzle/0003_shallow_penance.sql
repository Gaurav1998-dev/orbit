CREATE TABLE "analysis_x_post" (
	"id" text PRIMARY KEY NOT NULL,
	"analysis_id" text NOT NULL,
	"post_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis_x_post" ADD CONSTRAINT "analysis_x_post_analysis_id_analysis_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_x_post" ADD CONSTRAINT "analysis_x_post_post_id_x_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."x_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "x_post" ADD CONSTRAINT "x_post_post_id_unique" UNIQUE("post_id");