import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2, Upload, X } from "lucide-react";
import { SiteSettings } from "@/types/survey";

function FileUploadField({
  label,
  value,
  onUploaded,
  bucket = "site-assets",
  folder = "",
}: {
  label: string;
  value: string | null;
  onUploaded: (url: string | null) => void;
  bucket?: string;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onUploaded(urlData.publicUrl);
      toast.success(`${label} berhasil diupload`);
    } catch (err: any) {
      if (import.meta.env.DEV) console.error(err);
      toast.error(`Gagal upload ${label}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt={label} className="h-12 w-12 rounded object-cover border" />
          <button
            type="button"
            onClick={() => onUploaded(null)}
            className="text-xs text-destructive hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Hapus
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}

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
    background_url: "",
    cs_contact: "",
    primary_color: "#222222",
    accent_color: "#FBBF24",
    header_color: "#222222",
    progress_color: "#EF4444",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("*").single();
    if (error && import.meta.env.DEV) console.error(error);
    else if (data) setSettings(data as unknown as SiteSettings);
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
          background_url: (settings as any).background_url || null,
          cs_contact: settings.cs_contact || null,
          primary_color: settings.primary_color || "#222222",
          accent_color: settings.accent_color || "#FBBF24",
          header_color: settings.header_color || "#222222",
          progress_color: settings.progress_color || "#EF4444",
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);
      if (error) throw error;
      toast.success("Settings berhasil disimpan");
    } catch (error: any) {
      if (import.meta.env.DEV) console.error(error);
      toast.error("Gagal menyimpan settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="site_name">Nama Website</Label>
            <Input
              id="site_name"
              placeholder="Contoh: MyWebsite"
              value={settings.site_name || ""}
              onChange={(e) => handleChange("site_name", e.target.value)}
            />
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
            <Label htmlFor="cs_contact">Link Hubungi CS</Label>
            <Input
              id="cs_contact"
              placeholder="https://wa.me/62812345678"
              value={settings.cs_contact || ""}
              onChange={(e) => handleChange("cs_contact", e.target.value)}
            />
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-4">Upload Assets</h3>
            <div className="grid gap-5">
              <FileUploadField
                label="Logo"
                value={settings.logo_url || null}
                onUploaded={(url) => handleChange("logo_url", url || "")}
                folder="logo/"
              />
              <FileUploadField
                label="Favicon"
                value={settings.favicon_url || null}
                onUploaded={(url) => handleChange("favicon_url", url || "")}
                folder="favicon/"
              />
              <FileUploadField
                label="Background Image"
                value={(settings as any).background_url || null}
                onUploaded={(url) => handleChange("background_url", url || "")}
                folder="background/"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-4">Warna Tema</h3>
            <div className="grid gap-4">
              {[
                { id: "header_color", label: "Warna Header", fallback: "#222222" },
                { id: "primary_color", label: "Warna Tombol Utama", fallback: "#222222" },
                { id: "accent_color", label: "Warna Aksen", fallback: "#FBBF24" },
                { id: "progress_color", label: "Warna Progress Bar", fallback: "#EF4444" },
                { id: "background_color", label: "Warna Background (Fallback)", fallback: "#f8fafc" },
              ].map(({ id, label, fallback }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-sm">{label}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={id}
                      type="color"
                      value={(settings as any)[id] || fallback}
                      onChange={(e) => handleChange(id, e.target.value)}
                      className="w-12 h-9 p-1 cursor-pointer rounded"
                    />
                    <Input
                      value={(settings as any)[id] || fallback}
                      onChange={(e) => handleChange(id, e.target.value)}
                      placeholder={fallback}
                      className="flex-1 h-9"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-foreground text-background hover:bg-foreground/90">
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
    </div>
  );
}
