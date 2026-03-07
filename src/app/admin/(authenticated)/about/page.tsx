"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export default function AboutAdminPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const wechatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/page-content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  const update = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const uploadImage = async (file: File, key: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      update(key, url);
      toast.success("图片上传成功");
    } else {
      toast.error("上传失败");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        about_bio: content.about_bio || "",
        about_bio_en: content.about_bio_en || "",
        about_avatar: content.about_avatar || "",
        contact_email: content.contact_email || "",
        contact_github: content.contact_github || "",
        contact_wechat_qr: content.contact_wechat_qr || "",
      }),
    });
    setSaving(false);
    if (res.ok) toast.success("保存成功");
    else toast.error("保存失败");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">关于我</h1>
      <div className="space-y-6">

        <Card>
          <CardHeader><CardTitle>头像</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {content.about_avatar && (
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-border">
                <Image src={content.about_avatar} alt="avatar" fill className="object-cover" sizes="128px" />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={content.about_avatar || ""}
                onChange={(e) => update("about_avatar", e.target.value)}
                placeholder="图片 URL 或点击上传"
                className="flex-1"
              />
              <Button variant="outline" onClick={() => avatarInputRef.current?.click()} disabled={uploading}>
                上传
              </Button>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file, "about_avatar");
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>个人简介</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>简介（中文）</Label>
              <Textarea
                value={content.about_bio || ""}
                onChange={(e) => update("about_bio", e.target.value)}
                rows={5}
                placeholder="介绍一下你自己..."
              />
            </div>
            <div>
              <Label>Bio (English)</Label>
              <Textarea
                value={content.about_bio_en || ""}
                onChange={(e) => update("about_bio_en", e.target.value)}
                rows={5}
                placeholder="Tell something about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>联系方式</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>邮箱</Label>
              <Input
                value={content.contact_email || ""}
                onChange={(e) => update("contact_email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label>GitHub 主页 URL</Label>
              <Input
                value={content.contact_github || ""}
                onChange={(e) => update("contact_github", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <Label>微信二维码</Label>
              {content.contact_wechat_qr && (
                <div className="relative mb-2 h-36 w-36 overflow-hidden rounded-xl border border-border">
                  <Image src={content.contact_wechat_qr} alt="wechat qr" fill className="object-contain" sizes="144px" />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={content.contact_wechat_qr || ""}
                  onChange={(e) => update("contact_wechat_qr", e.target.value)}
                  placeholder="图片 URL 或点击上传"
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => wechatInputRef.current?.click()} disabled={uploading}>
                  上传
                </Button>
              </div>
              <input
                ref={wechatInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, "contact_wechat_qr");
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving || uploading}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}
