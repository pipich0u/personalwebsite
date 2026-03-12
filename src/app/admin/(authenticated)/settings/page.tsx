"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Music, QrCode, X } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingBgm, setUploadingBgm] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (
    file: File,
    settingKey: string,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        updateSetting(settingKey, data.url);
        // Auto-save this setting
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [settingKey]: data.url }),
        });
        toast.success("上传成功");
      } else {
        const err = await res.json();
        toast.error(err.error || "上传失败");
      }
    } catch {
      toast.error("上传失败");
    }
    setUploading(false);
  };

  const clearSetting = async (key: string) => {
    updateSetting(key, "");
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: "" }),
    });
    toast.success("已清除");
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
        {/* Homepage media settings */}
        <Card>
          <CardHeader>
            <CardTitle>首页媒体</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BGM Upload */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Music className="h-4 w-4" />
                背景音乐
              </Label>
              {settings.home_bgm_url ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <audio
                    src={settings.home_bgm_url}
                    controls
                    className="h-8 flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearSetting("home_bgm_url")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    ref={bgmInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "home_bgm_url", setUploadingBgm);
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => bgmInputRef.current?.click()}
                    disabled={uploadingBgm}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingBgm ? "上传中..." : "上传音乐文件"}
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    支持 MP3、WAV、OGG、M4A，最大 50MB
                  </p>
                </div>
              )}
            </div>

            {/* QR Code Upload */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                联系二维码
              </Label>
              {settings.contact_qrcode_url ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <img
                    src={settings.contact_qrcode_url}
                    alt="QR Code"
                    className="h-24 w-24 rounded object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearSetting("contact_qrcode_url")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    ref={qrInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "contact_qrcode_url", setUploadingQr);
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => qrInputRef.current?.click()}
                    disabled={uploadingQr}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingQr ? "上传中..." : "上传二维码图片"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
