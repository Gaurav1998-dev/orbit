"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How does the analysis work?",
    answer:
      "When you run an analysis, we fetch recent posts from the target X handle and rank them by engagement score. The top 5 and bottom 5 posts are then sent to an AI model which compares them side-by-side — identifying what the best content does well and what the underperforming content is missing. You get actionable insights on themes, writing style, and engagement patterns.",
  },
  {
    question: "How is the engagement score calculated?",
    answer:
      'The engagement score is an engagement rate with Bayesian smoothing. We sum all engagements on a post (likes, retweets, replies, quotes, and bookmarks) and divide by impressions. To avoid extreme scores on low-impression posts, we apply a small smoothing constant — this means a post with 2 likes and 10 impressions won\'t appear "better" than a post with 200 likes and 10,000 impressions.',
  },
  {
    question:
      "I selected 100 posts, but the analysis seems to cover fewer. Why?",
    answer:
      "Replies from the target handle to its own posts are automatically filtered out before analysis — only original posts from the target handle are analyzed. So if you request 100 posts and 30 of them are replies, the analysis will be based on the remaining 70 original posts. The top 5 and bottom 5 are then picked from that filtered set.",
  },
  {
    question: "Why only the top 5 and bottom 5 posts?",
    answer:
      "Comparing extremes gives the clearest signal. The top 5 posts represent what resonates most with the target handle's audience, while the bottom 5 reveal what falls flat. Analyzing the contrast between these two groups surfaces actionable patterns that would be diluted if we included all posts.",
  },
  {
    question: "Can I customize the analysis prompt?",
    answer:
      'Yes! Click the "Analysis Prompt" option in the sidebar to view and edit the analysis prompt. You can tailor it to focus on specific aspects of the content, like tone, topic, or format.',
  },
];

export function AnalysisFaq() {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Frequently Asked Questions
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
