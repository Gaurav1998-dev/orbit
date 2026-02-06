import type { xPost } from "@/db/x-schema";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

type XPostRecord = typeof xPost.$inferSelect;

const model = anthropic("claude-opus-4-5");

export async function analyzeXPostsWithAI(
  topXPostRecords: XPostRecord[],
  bottomXPostRecords: XPostRecord[],
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

  const { text } = await generateText({
    model,
    prompt: `You are a social media analytics expert. Analyze the following top-performing and underperforming X (Twitter) posts together to identify patterns, contrasts, and actionable insights.

## Top 5 Performing Posts
${formattedTopPosts}

## Bottom 5 Performing Posts
${formattedBottomPosts}

## Your Task
Compare and contrast the top-performing and underperforming posts. Look for:
- What the top posts did well that the bottom posts lacked
- Common themes, topics, or subject matter in each group
- Writing style differences (tone, length, structure)
- Use of hooks, attention-grabbing openers, or calls to action
- Patterns in engagement triggers vs. engagement killers
- Timing or formatting patterns

## Output Format
Provide your analysis in the following structure:

1. **What's Working** (3-5 bullet points): Key patterns from top-performing posts
2. **What's Not Working** (3-5 bullet points): Key patterns from underperforming posts
3. **Key Differences**: The most important contrasts between top and bottom posts
4. **Content Themes**: What topics/themes resonate vs. fall flat
5. **Style Analysis**: Observations about writing style, length, and tone across both groups
6. **Actionable Recommendations** (3-5 bullet points): Specific, actionable advice for future posts based on this comparative analysis

Keep your analysis concise but insightful. Focus on patterns that are actionable.`,
  });

  return text;
}
