"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AnalysisPage({ params }: PageProps) {
  const { slug } = use(params);

  const {
    data: analysis,
    isLoading,
    error,
  } = useQuery(trpc.xAnalysis.getById.queryOptions({ analysisId: slug }));

  if (isLoading) {
    return <AnalysisSkeleton />;
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Analysis not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header with X User Info */}
      <div className="flex items-center gap-4">
        <Badge
          variant={
            analysis.analysisStage === "completed" ? "default" : "secondary"
          }
        >
          {analysis.analysisStage}
        </Badge>
      </div>

      {/* Analysis Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top 5 Posts Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>
              Analysis of your best performing content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.top5PostsAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.top5PostsAnalysis}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">Analysis pending...</p>
            )}
          </CardContent>
        </Card>

        {/* Bottom 5 Posts Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Underperforming Posts</CardTitle>
            <CardDescription>
              Analysis of content that could be improved
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.bottom5PostsAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.bottom5PostsAnalysis}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">Analysis pending...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Posts Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        <PostsList
          title="Top 5 Posts"
          posts={analysis.analysisXPosts
            .filter((p) => p.rank === "top_5")
            .map((p) => p.post)}
        />
        <PostsList
          title="Bottom 5 Posts"
          posts={analysis.analysisXPosts
            .filter((p) => p.rank === "bottom_5")
            .map((p) => p.post)}
        />
      </div>
    </div>
  );
}

interface Post {
  id: string;
  xPostId: string;
  text: string | null;
  likeCount: number | null;
  retweetCount: number | null;
  replyCount: number | null;
  impressionCount: number | null;
  engagementScore: number;
}

function PostsList({ title, posts }: { title: string; posts: Post[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts available</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border-b pb-4 last:border-0">
              <p className="text-sm mb-2">{post.text}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>❤️ {post.likeCount ?? 0}</span>
                <span>🔁 {post.retweetCount ?? 0}</span>
                <span>💬 {post.replyCount ?? 0}</span>
                <span>👁️ {post.impressionCount ?? 0}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
