import { relations } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { analysis, analysisXPost } from "./analysis-schema";

export const xUser = pgTable("x_user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  xUserId: text("x_user_id").notNull().unique(),
  xUsername: text("x_username").notNull().unique(),
  xUrl: text("x_url"),
  xProfileImageUrl: text("x_profile_image_url"),
  xDescription: text("x_description"),
  xUserCreatedAt: text("x_user_created_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const xPost = pgTable("x_post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  xUserFk: text("x_user_fk")
    .notNull()
    .references(() => xUser.id, { onDelete: "cascade" }),
  xPostId: text("x_post_id").notNull().unique(),
  text: text("text"),
  retweetCount: integer("retweet_count"),
  replyCount: integer("reply_count"),
  likeCount: integer("like_count"),
  quoteCount: integer("quote_count"),
  bookmarkCount: integer("bookmark_count"),
  impressionCount: integer("impression_count"),
  postCreatedAt: text("post_created_at"),
  engagementScore: doublePrecision("engagement_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const xUserRelations = relations(xUser, ({ many }) => ({
  xPosts: many(xPost),
  analyses: many(analysis),
}));

export const xPostRelations = relations(xPost, ({ one, many }) => ({
  xUser: one(xUser, {
    fields: [xPost.xUserFk],
    references: [xUser.id],
  }),
  analysisXPosts: many(analysisXPost),
}));
