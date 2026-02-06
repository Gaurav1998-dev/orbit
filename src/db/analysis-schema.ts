import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "./auth-schema";
import { xPost, xUser } from "./x-schema";

export const analysisStage = pgEnum("analysis_stage", ["pending", "completed"]);
export const analysisRank = pgEnum("rank", ["top_5", "bottom_5", "middle"]);

export const analysis = pgTable("analysis", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  xUserFk: text("x_user_fk")
    .notNull()
    .references(() => xUser.id, { onDelete: "cascade" }),
  top5PostsAnalysis: text("top_5_posts_analysis"),
  bottom5PostsAnalysis: text("bottom_5_posts_analysis"),
  analysisStage: analysisStage("analysis_stage"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analysisXPost = pgTable("analysis_x_post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  rank: analysisRank("rank").notNull(),
  analysisId: text("analysis_id")
    .notNull()
    .references(() => analysis.id, { onDelete: "cascade" }),
  xPostFk: text("x_post_fk")
    .notNull()
    .references(() => xPost.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analysisRelations = relations(analysis, ({ one, many }) => ({
  xUser: one(xUser, {
    fields: [analysis.xUserFk],
    references: [xUser.id],
  }),
  user: one(user, {
    fields: [analysis.userId],
    references: [user.id],
  }),
  analysisXPosts: many(analysisXPost),
}));

export const analysisXPostRelations = relations(analysisXPost, ({ one }) => ({
  analysis: one(analysis, {
    fields: [analysisXPost.analysisId],
    references: [analysis.id],
  }),
  post: one(xPost, {
    fields: [analysisXPost.xPostFk],
    references: [xPost.id],
  }),
}));