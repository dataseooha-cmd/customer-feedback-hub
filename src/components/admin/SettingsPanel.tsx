import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { SiteSettings } from "@/types/survey";

export function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    site_name: "",
    site_title: "",
    site_description: "",
    logo_url: "",
    favicon_url: "",
    background_color: "#f8fafc",
    cs_contact: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (error) {
      console.error(error);
    } else if (data) {
      setSettings(data as SiteSettings);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          site_name: settings.site_name,
          site_title: settings.site_title,
          site_description: settings.site_description,
          logo_url: settings.logo_url || null,
          favicon_url: settings.favicon_url || null,
          background_color: settings.background_color || "#f8fafc",
          cs_contact: settings.cs_contact || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Settings berhasil disimpan");
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-6 bg-card rounded-lg border border-border space-y-6">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Pengaturan Website
        </h2>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Nama Website</Label>
            <Input
              id="site_name"
              placeholder="Contoh: MyWebsite"
              value={settings.site_name || ""}
              onChange={(e) => handleChange("site_name", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Nama ini akan digunakan di pertanyaan survei (menggantikan "nama web")
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_title">Judul Survei</Label>
            <Input
              id="site_title"
              placeholder="Contoh: Survei Kepuasan Pelanggan"
              value={settings.site_title || ""}
              onChange={(e) => handleChange("site_title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Deskripsi Survei</Label>
            <Textarea
              id="site_description"
              placeholder="Deskripsi singkat survei..."
              value={settings.site_description || ""}
              onChange={(e) => handleChange("site_description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">URL Logo</Label>
            <Input
              id="logo_url"
              placeholder="https://example.com/logo.png"
              value={settings.logo_url || ""}
              onChange={(e) => handleChange("logo_url", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon_url">URL Favicon</Label>
            <Input
              id="favicon_url"
              placeholder="https://example.com/favicon.ico"
              value={settings.favicon_url || ""}
              onChange={(e) => handleChange("favicon_url", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="background_color">Warna Background</Label>
            <div className="flex gap-2">
              <Input
                id="background_color"
                type="color"
                value={settings.background_color || "#f8fafc"}
                onChange={(e) => handleChange("background_color", e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={settings.background_color || "#f8fafc"}
                onChange={(e) => handleChange("background_color", e.target.value)}
                placeholder="#f8fafc"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs_contact">Link Hubungi CS</Label>
            <Input
              id="cs_contact"
              placeholder="https://wa.me/62812345678"
              value={settings.cs_contact || ""}
              onChange={(e) => handleChange("cs_contact", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Link WhatsApp, Telegram, atau kontak lainnya
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="gap-2 survey-gradient border-0">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Settings
            </>
          )}
        </Button>
      </div>

      <div className="p-6 bg-card rounded-lg border border-border space-y-4">
        <h2 className="text-xl font-display font-semibold text-foreground">
          Catatan SEO
        </h2>
        <p className="text-sm text-muted-foreground">
          Untuk mengubah favicon dan meta tags secara global, Anda bisa mengedit file 
          <code className="mx-1 px-1 py-0.5 bg-secondary rounded">index.html</code>
          di root project.
        </p>
      </div>
    </div>
  );
}
