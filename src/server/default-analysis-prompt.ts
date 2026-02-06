export const DEFAULT_ANALYSIS_PROMPT = `You are a social media analytics expert. Analyze the following top-performing and underperforming X (Twitter) posts together to identify patterns, contrasts, and actionable insights.

## Top 5 Performing Posts
{topPosts}

## Bottom 5 Performing Posts
{bottomPosts}

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

Keep your analysis concise but insightful. Focus on patterns that are actionable.`;
