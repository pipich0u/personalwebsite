"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostEditor } from "@/components/admin/PostEditor";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    title: "",
    titleEn: "",
    slug: "",
    excerpt: "",
    excerptEn: "",
    content: "",
    contentEn: "",
    coverImage: "",
    categoryId: "",
    tags: "",
    status: "draft",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([post, cats]) => {
      setForm({
        title: post.title || "",
        titleEn: post.titleEn || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        excerptEn: post.excerptEn || "",
        content: post.content || "",
        contentEn: post.contentEn || "",
        coverImage: post.coverImage || "",
        categoryId: post.categoryId || "",
        tags: post.tags || "",
        status: post.status || "draft",
      });
      setCategories(cats);
      setLoaded(true);
    });
  }, [id]);

  const handleSubmit = async (status: string) => {
    if (!form.title || !form.content) {
      toast.error("标题和内容不能为空");
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });

    setSaving(false);

    if (res.ok) {
      toast.success("文章已更新");
      router.push("/admin/posts");
    } else {
      toast.error("保存失败");
    }
  };

  if (!loaded) {
    return <p className="text-muted-foreground">加载中...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">编辑文章</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="zh">
              <TabsList>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="zh" className="space-y-4">
                <div>
                  <Label>标题</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>摘要</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excerpt: e.target.value }))
                    }
                    rows={2}
                  />
                </div>
              </TabsContent>
              <TabsContent value="en" className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.titleEn}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, titleEn: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={form.excerptEn}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excerptEn: e.target.value }))
                    }
                    rows={2}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>分类</Label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">未分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>封面图片URL</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, coverImage: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>文章内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="zh">
              <TabsList>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="zh">
                <PostEditor
                  content={form.content}
                  onChange={(html) =>
                    setForm((f) => ({ ...f, content: html }))
                  }
                />
              </TabsContent>
              <TabsContent value="en">
                <PostEditor
                  content={form.contentEn}
                  onChange={(html) =>
                    setForm((f) => ({ ...f, contentEn: html }))
                  }
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => handleSubmit("draft")}
            variant="outline"
            disabled={saving}
          >
            保存草稿
          </Button>
          <Button onClick={() => handleSubmit("published")} disabled={saving}>
            {form.status === "published" ? "更新发布" : "发布文章"}
          </Button>
        </div>
      </div>
    </div>
  );
}
