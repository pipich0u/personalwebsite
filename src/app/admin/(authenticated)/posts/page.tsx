"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PostWithCategory } from "@/types";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchPosts = async () => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    else params.delete("status");
    // For admin, fetch all statuses
    const url = filter === "all"
      ? "/api/posts?status=published&limit=100"
      : `/api/posts?status=${filter}&limit=100`;

    // Fetch both published and drafts for admin
    const [pubRes, draftRes] = await Promise.all([
      fetch("/api/posts?status=published&limit=100"),
      fetch("/api/posts?status=draft&limit=100"),
    ]);
    const pubData = await pubRes.json();
    const draftData = await draftRes.json();

    if (filter === "published") setPosts(pubData.posts);
    else if (filter === "draft") setPosts(draftData.posts);
    else setPosts([...pubData.posts, ...draftData.posts]);
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const deletePost = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("文章已删除");
      fetchPosts();
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-1 h-4 w-4" />
            新建文章
          </Link>
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {["all", "published", "draft"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "全部" : f === "published" ? "已发布" : "草稿"}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">暂无文章</p>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge
                        variant={
                          post.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {post.status === "published" ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.category?.name || "未分类"} ·{" "}
                      {new Date(post.updatedAt).toLocaleDateString("zh-CN")} ·{" "}
                      {post.viewCount} 阅读
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
