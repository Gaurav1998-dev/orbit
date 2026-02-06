ALTER TABLE "x_post" RENAME COLUMN "x_user_id" TO "x_user_fk";--> statement-breakpoint
ALTER TABLE "x_post" RENAME COLUMN "post_id" TO "x_post_id";--> statement-breakpoint
ALTER TABLE "analysis" RENAME COLUMN "x_user_id" TO "x_user_fk";--> statement-breakpoint
ALTER TABLE "analysis_x_post" RENAME COLUMN "post_id" TO "x_post_fk";--> statement-breakpoint
ALTER TABLE "x_post" DROP CONSTRAINT "x_post_post_id_unique";--> statement-breakpoint
ALTER TABLE "x_post" DROP CONSTRAINT "x_post_x_user_id_x_user_id_fk";
--> statement-breakpoint
ALTER TABLE "analysis" DROP CONSTRAINT "analysis_x_user_id_x_user_id_fk";
--> statement-breakpoint
ALTER TABLE "analysis_x_post" DROP CONSTRAINT "analysis_x_post_post_id_x_post_id_fk";
--> statement-breakpoint
ALTER TABLE "x_post" ADD CONSTRAINT "x_post_x_user_fk_x_user_id_fk" FOREIGN KEY ("x_user_fk") REFERENCES "public"."x_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_x_user_fk_x_user_id_fk" FOREIGN KEY ("x_user_fk") REFERENCES "public"."x_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_x_post" ADD CONSTRAINT "analysis_x_post_x_post_fk_x_post_id_fk" FOREIGN KEY ("x_post_fk") REFERENCES "public"."x_post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "x_post" ADD CONSTRAINT "x_post_x_post_id_unique" UNIQUE("x_post_id");