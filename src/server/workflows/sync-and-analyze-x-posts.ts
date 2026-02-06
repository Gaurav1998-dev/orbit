import { db } from "@/db";
import { analysis, analysisXPost } from "@/db/analysis-schema";
import { xPost } from "@/db/x-schema";
import { analyzeXPostsWithAI } from "@/server/ai";
import { eq, sql } from "drizzle-orm";

type XPostRecord = typeof xPost.$inferSelect;

interface XApiTweet {
  id: string;
  text: string;
  created_at?: string;
  in_reply_to_user_id?: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
}

interface XApiResponse {
  data?: XApiTweet[];
}

export async function syncAndAnalyzeXPosts(
  xUserRecordId: string,
  xUserRecordXUserId: string,
  analysisRecordId: string,
  maxPosts: number = 100,
) {
  "use workflow";

  const recentXUserPostRecords = await syncXUserPosts(
    xUserRecordId,
    xUserRecordXUserId,
    maxPosts,
  );
  await analyzeXPosts(recentXUserPostRecords ?? [], analysisRecordId);
}

async function syncXUserPosts(
  xUserRecordId: string,
  xUserRecordXUserId: string,
  maxPosts: number = 100,
) {
  "use step";

  /**
   * Fetch posts via X API v2
   */
  const params = new URLSearchParams({
    max_results: String(Math.min(100, Math.max(5, maxPosts))),
    exclude: "replies,retweets",
    "tweet.fields": "public_metrics,created_at,in_reply_to_user_id",
  });

  const apiResponse = await fetch(
    `https://api.x.com/2/users/${xUserRecordXUserId}/tweets?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    },
  );

  if (!apiResponse.ok) {
    throw new Error(`X API error: ${apiResponse.status} ${apiResponse.statusText}`);
  }

  const response: XApiResponse = await apiResponse.json();

  console.log("response:", response);

  // Filter out replies (posts with in_reply_to_user_id set)
  const filteredPosts = (response.data ?? []).filter(
    (post) => post.in_reply_to_user_id === undefined,
  );

  console.log("filteredPosts:", filteredPosts);

  /**
   * Batch upsert xPost records
   */
  const valuesToInsert = filteredPosts.map((post) => {
    const engagements =
      (post.public_metrics?.retweet_count ?? 0) +
      (post.public_metrics?.reply_count ?? 0) +
      (post.public_metrics?.like_count ?? 0) +
      (post.public_metrics?.quote_count ?? 0) +
      (post.public_metrics?.bookmark_count ?? 0);

    const impressions = post.public_metrics?.impression_count ?? 0;
    const C = 100;
    const M = 0.02;
    const engagementScore = (engagements + C * M) / (impressions + C);

    return {
      xUserFk: xUserRecordId,
      xPostId: post.id ?? "",
      text: post.text ?? "",
      retweetCount: post.public_metrics?.retweet_count ?? 0,
      replyCount: post.public_metrics?.reply_count ?? 0,
      likeCount: post.public_metrics?.like_count ?? 0,
      quoteCount: post.public_metrics?.quote_count ?? 0,
      bookmarkCount: post.public_metrics?.bookmark_count ?? 0,
      impressionCount: post.public_metrics?.impression_count ?? 0,
      postCreatedAt: post.created_at ?? "",
      engagementScore,
    };
  });

  const recentXUserPostRecords =
    valuesToInsert.length > 0
      ? await db
          .insert(xPost)
          .values(valuesToInsert)
          .onConflictDoUpdate({
            target: xPost.xPostId,
            set: {
              text: sql`excluded.text`,
              retweetCount: sql`excluded.retweet_count`,
              replyCount: sql`excluded.reply_count`,
              likeCount: sql`excluded.like_count`,
              quoteCount: sql`excluded.quote_count`,
              bookmarkCount: sql`excluded.bookmark_count`,
              impressionCount: sql`excluded.impression_count`,
              engagementScore: sql`excluded.engagement_score`,
              updatedAt: new Date(),
            },
          })
          .returning()
      : [];

  return recentXUserPostRecords;
}

async function analyzeXPosts(
  recentXUserPostRecords: XPostRecord[],
  analysisRecordId: string,
) {
  "use step";

  const top5XPostRecords = recentXUserPostRecords
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 5);

  const bottom5XPostRecords = recentXUserPostRecords
    .sort((a, b) => a.engagementScore - b.engagementScore)
    .slice(0, 5);

  const topPostsAnalysis = await analyzeXPostsWithAI(top5XPostRecords, "top");
  const bottomPostsAnalysis = await analyzeXPostsWithAI(
    bottom5XPostRecords,
    "bottom",
  );

  await db
    .update(analysis)
    .set({
      top5PostsAnalysis: topPostsAnalysis,
      bottom5PostsAnalysis: bottomPostsAnalysis,
      analysisStage: "completed",
    })
    .where(eq(analysis.id, analysisRecordId));

  /**
   * Batch insert analysisXPost records (join records)
   */
  const top5Ids = new Set(top5XPostRecords.map((r) => r.id));
  const bottom5Ids = new Set(bottom5XPostRecords.map((r) => r.id));

  const analysisXPostRecords = recentXUserPostRecords.map((record) => {
    let rank: "top_5" | "bottom_5" | "middle";

    if (top5Ids.has(record.id)) {
      rank = "top_5";
    } else if (bottom5Ids.has(record.id)) {
      rank = "bottom_5";
    } else {
      rank = "middle";
    }

    return {
      analysisId: analysisRecordId,
      xPostFk: record.id,
      rank,
    };
  });

  await db.insert(analysisXPost).values(analysisXPostRecords);
}
