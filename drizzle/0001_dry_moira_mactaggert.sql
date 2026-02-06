CREATE TABLE "x_post" (
	"id" text PRIMARY KEY NOT NULL,
	"x_user_id" text NOT NULL,
	"post_id" text NOT NULL,
	"text" text,
	"retweet_count" integer,
	"reply_count" integer,
	"like_count" integer,
	"quote_count" integer,
	"bookmark_count" integer,
	"impression_count" integer,
	"post_created_at" text,
	"engagement_score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "x_user" (
	"id" text PRIMARY KEY NOT NULL,
	"x_user_id" text NOT NULL,
	"x_username" text NOT NULL,
	"x_url" text,
	"x_profile_image_url" text,
	"x_description" text,
	"x_user_created_at" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "x_user_x_user_id_unique" UNIQUE("x_user_id"),
	CONSTRAINT "x_user_x_username_unique" UNIQUE("x_username")
);
--> statement-breakpoint
ALTER TABLE "x_post" ADD CONSTRAINT "x_post_x_user_id_x_user_id_fk" FOREIGN KEY ("x_user_id") REFERENCES "public"."x_user"("id") ON DELETE cascade ON UPDATE no action;