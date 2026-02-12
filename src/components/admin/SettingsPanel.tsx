import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2, Upload, X, Image, Globe, Palette } from "lucide-react";
import { SiteSettings } from "@/types/survey";

function FileUploadField({
  label,
  description,
  value,
  onUploaded,
  bucket = "site-assets",
  folder = "",
  previewSize = "md",
}: {
  label: string;
  description?: string;
  value: string | null;
  onUploaded: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  previewSize?: "sm" | "md" | "lg";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const sizeClass = previewSize === "sm" ? "h-10 w-10" : previewSize === "lg" ? "h-24 w-full max-w-xs" : "h-14 w-14";

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
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onUploaded(null)}
              className="text-xs text-destructive hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Hapus
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="gap-1.5"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : value ? "Ganti" : "Upload"}
          </Button>
        </div>
      </div>
      {value && (
        <div className="flex items-center gap-3">
          <img src={value} alt={label} className={`${sizeClass} rounded-lg object-cover border border-border`} />
          <p className="text-xs text-muted-foreground truncate flex-1">{value.split("/").pop()}</p>
        </div>
      )}
      {!value && (
        <div className="flex items-center justify-center h-16 rounded-lg border-2 border-dashed border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">Belum ada file</p>
        </div>
      )}
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
      toast.success("Settings berhasil disimpan! Perubahan akan terlihat di form survei.");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6">
      {/* Website Info */}
      <div className="p-4 sm:p-6 bg-card rounded-lg border border-border space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Informasi Website</h2>
        </div>

        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="site_name" className="text-sm">Nama Website</Label>
            <Input
              id="site_name"
              placeholder="Contoh: MyWebsite"
              value={settings.site_name || ""}
              onChange={(e) => handleChange("site_name", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="site_title" className="text-sm">Judul Survei</Label>
            <Input
              id="site_title"
              placeholder="Contoh: Survei Kepuasan Pelanggan"
              value={settings.site_title || ""}
              onChange={(e) => handleChange("site_title", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="site_description" className="text-sm">Deskripsi Survei</Label>
            <Textarea
              id="site_description"
              placeholder="Deskripsi singkat survei..."
              value={settings.site_description || ""}
              onChange={(e) => handleChange("site_description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cs_contact" className="text-sm">Link Hubungi CS</Label>
            <Input
              id="cs_contact"
              placeholder="https://wa.me/62812345678"
              value={settings.cs_contact || ""}
              onChange={(e) => handleChange("cs_contact", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Assets Upload */}
      <div className="p-4 sm:p-6 bg-card rounded-lg border border-border space-y-5">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Upload Assets</h2>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Perubahan akan diterapkan setelah menekan tombol <strong>Simpan Settings</strong>.
        </p>

        <div className="grid gap-4">
          <FileUploadField
            label="Logo"
            description="Logo website yang tampil di header survei"
            value={settings.logo_url || null}
            onUploaded={(url) => handleChange("logo_url", url || "")}
            folder="logo/"
          />
          <FileUploadField
            label="Favicon"
            description="Icon kecil yang tampil di tab browser"
            value={settings.favicon_url || null}
            onUploaded={(url) => handleChange("favicon_url", url || "")}
            folder="favicon/"
            previewSize="sm"
          />
          <FileUploadField
            label="Background Image"
            description="Gambar latar belakang halaman survei"
            value={(settings as any).background_url || null}
            onUploaded={(url) => handleChange("background_url", url || "")}
            folder="background/"
            previewSize="lg"
          />
        </div>
      </div>

      {/* Warna Kustomisasi */}
      <div className="p-4 sm:p-6 bg-card rounded-lg border border-border space-y-5">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Warna Kustomisasi</h2>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Atur warna header dan background halaman survei.
        </p>

        <div className="grid gap-4">
          {/* Header Color */}
          <div className="space-y-1.5">
            <Label htmlFor="header_color" className="text-sm">Warna Header Survei</Label>
            <p className="text-xs text-muted-foreground">Warna latar belakang bagian judul survei</p>
            <div className="flex gap-2">
              <Input
                id="header_color"
                type="color"
                value={settings.header_color || "#222222"}
                onChange={(e) => handleChange("header_color", e.target.value)}
                className="w-12 h-9 p-1 cursor-pointer rounded"
              />
              <Input
                value={settings.header_color || "#222222"}
                onChange={(e) => handleChange("header_color", e.target.value)}
                placeholder="#222222"
                className="flex-1 h-9"
              />
            </div>
            {/* Preview */}
            <div
              className="rounded-lg p-3 mt-2 flex items-center gap-2"
              style={{ background: settings.header_color || "#222222" }}
            >
              <span className="text-white text-xs font-medium">Preview Header</span>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-1.5">
            <Label htmlFor="background_color" className="text-sm">Warna Background Survei</Label>
            <p className="text-xs text-muted-foreground">Digunakan jika tidak ada background image</p>
            <div className="flex gap-2">
              <Input
                id="background_color"
                type="color"
                value={settings.background_color || "#f8fafc"}
                onChange={(e) => handleChange("background_color", e.target.value)}
                className="w-12 h-9 p-1 cursor-pointer rounded"
              />
              <Input
                value={settings.background_color || "#f8fafc"}
                onChange={(e) => handleChange("background_color", e.target.value)}
                placeholder="#f8fafc"
                className="flex-1 h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
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
  );
}
