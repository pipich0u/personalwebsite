"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Send, FileEdit } from "lucide-react";
import Link from "next/link";

interface Analytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  recentPosts: {
    id: string;
    title: string;
    status: string;
    viewCount: number;
    updatedAt: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p className="text-muted-foreground">加载中...</p>;
  }

  const stats = [
    { label: "总文章", value: data.totalPosts, icon: FileText },
    { label: "已发布", value: data.publishedPosts, icon: Send },
    { label: "草稿", value: data.draftPosts, icon: FileEdit },
    { label: "总阅读", value: data.totalViews, icon: Eye },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">仪表盘</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <stat.icon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近编辑</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无文章</p>
          ) : (
            <div className="space-y-3">
              {data.recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}/edit`}
                  className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.updatedAt).toLocaleDateString("zh-CN")} ·{" "}
                      {post.status === "published" ? "已发布" : "草稿"}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {post.viewCount} 阅读
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
