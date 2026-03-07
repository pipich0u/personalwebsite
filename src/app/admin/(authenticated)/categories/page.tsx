"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  sortOrder: number;
  _count: { posts: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newName || !newSlug) {
      toast.error("名称和Slug不能为空");
      return;
    }
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, nameEn: newNameEn, slug: newSlug }),
    });
    if (res.ok) {
      toast.success("分类已添加");
      setNewName("");
      setNewNameEn("");
      setNewSlug("");
      fetchCategories();
    } else {
      toast.error("添加失败");
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("分类已更新");
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("确定要删除这个分类吗？")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("分类已删除");
      fetchCategories();
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">分类管理</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>添加分类</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="分类名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="English Name"
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
            />
            <Input
              placeholder="slug"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
            <Button onClick={addCategory}>
              <Plus className="mr-1 h-4 w-4" />
              添加
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">暂无分类</p>
          ) : (
            <div className="divide-y divide-border">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 p-4">
                  <Input
                    defaultValue={cat.name}
                    className="w-32"
                    onBlur={(e) =>
                      updateCategory(cat.id, { name: e.target.value })
                    }
                  />
                  <Input
                    defaultValue={cat.nameEn || ""}
                    className="w-32"
                    placeholder="English"
                    onBlur={(e) =>
                      updateCategory(cat.id, { nameEn: e.target.value })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {cat._count.posts} 篇文章
                  </span>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
