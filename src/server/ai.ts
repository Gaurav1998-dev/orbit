import type { xPost } from "@/db/x-schema";
import { DEFAULT_ANALYSIS_PROMPT } from "@/server/default-analysis-prompt";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

type XPostRecord = typeof xPost.$inferSelect;

const model = anthropic("claude-opus-4-5");

export async function analyzeXPostsWithAI(
  topXPostRecords: XPostRecord[],
  bottomXPostRecords: XPostRecord[],
  customPrompt?: string | null,
) {
  function formatPosts(posts: XPostRecord[]) {
    return posts
      .map(
        (post, index) => `
  Post ${index + 1}:
  - Text: "${post.text}"
  - Likes: ${post.likeCount}
  - Retweets: ${post.retweetCount}
  - Replies: ${post.replyCount}
  - Quotes: ${post.quoteCount}
  - Bookmarks: ${post.bookmarkCount}
  - Impressions: ${post.impressionCount}
  - Engagement Score: ${post.engagementScore}
  - Posted: ${post.postCreatedAt}
  `,
      )
      .join("\n");
  }

  const formattedTopPosts = formatPosts(topXPostRecords);
  const formattedBottomPosts = formatPosts(bottomXPostRecords);

  const promptTemplate = customPrompt || DEFAULT_ANALYSIS_PROMPT;
  const prompt = promptTemplate
    .replace("{topPosts}", formattedTopPosts)
    .replace("{bottomPosts}", formattedBottomPosts);

  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}
