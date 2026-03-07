"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("设置已保存");
    } else {
      toast.error("保存失败");
    }
  };

  const fields = [
    { key: "site_title", label: "站点标题 (中文)", type: "input" },
    { key: "site_title_en", label: "站点标题 (English)", type: "input" },
    { key: "site_description", label: "站点描述 (中文)", type: "textarea" },
    { key: "site_description_en", label: "站点描述 (English)", type: "textarea" },
  ];

  const pageFields = [
    { key: "home_slogan", label: "首页标语 (中文)" },
    { key: "home_slogan_en", label: "首页标语 (English)" },
    { key: "home_subtitle", label: "首页副标题 (中文)" },
    { key: "home_subtitle_en", label: "首页副标题 (English)" },
    { key: "about_bio", label: "关于页简介 (中文)" },
    { key: "about_bio_en", label: "关于页简介 (English)" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">站点设置</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <Input
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>页面内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pageFields.map((field) => (
              <div key={field.key}>
                <Label>{field.label}</Label>
                <Textarea
                  value={settings[field.key] || ""}
                  onChange={(e) => updateSetting(field.key, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  );
}
