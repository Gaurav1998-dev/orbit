import type { xPost } from "@/db/x-schema";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

type XPostRecord = typeof xPost.$inferSelect;

const model = anthropic("claude-opus-4-5");

export async function analyzeXPostsWithAI(
  xPostRecords: XPostRecord[],
  type: "top" | "bottom",
) {
  // Format posts for better readability in the prompt
  const formattedPosts = xPostRecords
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

  const { text } = await generateText({
    model,
    prompt: `You are a social media analytics expert. Analyze these ${type === "top" ? "top-performing" : "lowest-performing"} X (Twitter) posts and identify patterns.
  
  ## Posts to Analyze
  ${formattedPosts}
  
  ## Your Task
  ${
    type === "top"
      ? `Identify what made these posts successful. Look for:
  - Common themes, topics, or subject matter
  - Writing style patterns (tone, length, structure)
  - Use of hooks or attention-grabbing openers
  - Emotional triggers or calls to action
  - Timing or formatting patterns
  - Any use of questions, lists, or storytelling`
      : `Identify what may have caused these posts to underperform. Look for:
  - Weak or unclear messaging
  - Topics that didn't resonate
  - Poor timing or formatting choices
  - Missing engagement hooks
  - Overly promotional or generic content
  - Any patterns in what to avoid`
  }
  
  ## Output Format
  Provide your analysis in the following structure:
  
  1. **Key Patterns** (3-5 bullet points): The most significant patterns you identified
  2. **Content Themes**: What topics/themes performed ${type === "top" ? "well" : "poorly"}
  3. **Style Analysis**: Observations about writing style, length, and tone
  4. **Actionable Recommendations** (3-5 bullet points): Specific, actionable advice for future posts based on this analysis
  
  Keep your analysis concise but insightful. Focus on patterns that are actionable.`,
  });

  return text;
}
