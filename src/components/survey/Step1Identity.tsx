import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioOption } from "./RadioOption";
import { SurveyData, REFERRAL_SOURCES } from "@/types/survey";
import { Textarea } from "@/components/ui/textarea";

interface Step1IdentityProps {
  data: Partial<SurveyData>;
  onChange: (field: keyof SurveyData, value: string) => void;
  siteName: string;
  errors: Record<string, string>;
}

export function Step1Identity({ data, onChange, siteName, errors }: Step1IdentityProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-card rounded-lg p-5">
        <h3 className="font-bold text-foreground mb-2">Selamat datang 👋</h3>
        <p className="text-sm text-muted-foreground">
          Survei ini terdiri dari <strong>3 langkah singkat</strong>. Waktu pengisian ± 1–2 menit. Data Anda kami jaga dengan baik untuk peningkatan kualitas layanan.
        </p>
      </div>

      {/* Identity */}
      <div className="bg-card rounded-lg p-5 space-y-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          🧑 Identitas Responden
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="user_id" className="text-sm font-medium">
              Userid <span className="text-destructive">*</span>
            </Label>
            <Input
              id="user_id"
              placeholder={`contoh: ${siteName.toLowerCase()}123`}
              value={data.user_id || ""}
              onChange={(e) => onChange("user_id", e.target.value)}
              className={`bg-white border ${errors.user_id ? "border-destructive" : "border-border"}`}
            />
            <p className="text-xs text-muted-foreground">
              Gunakan Userid yang terdaftar di {siteName}.
            </p>
            {errors.user_id && <p className="text-xs text-destructive">{errors.user_id}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp" className="text-sm font-medium">
              WhatsApp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="whatsapp"
              placeholder="contoh: 6281234567890"
              value={data.whatsapp || ""}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              className={`bg-white border ${errors.whatsapp ? "border-destructive" : "border-border"}`}
            />
            <p className="text-xs text-muted-foreground">
              Masukkan nomor WhatsApp yang aktif.
            </p>
            {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp}</p>}
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="bg-card rounded-lg p-5 space-y-3">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          📱 Kenal {siteName} dari mana? <span className="text-destructive">*</span>
        </h3>
        <div className="space-y-1">
          {REFERRAL_SOURCES.map((source) => (
            <RadioOption
              key={source.value}
              name="referral_source"
              value={source.value}
              label={source.label}
              selected={data.referral_source === source.value}
              onChange={(value) => onChange("referral_source", value)}
            />
          ))}
        </div>
        {errors.referral_source && <p className="text-xs text-destructive">{errors.referral_source}</p>}

        {data.referral_source === "lainnya" && (
          <div className="space-y-1.5 animate-slide-up">
            <Label htmlFor="referral_other" className="text-sm font-medium">
              Sebutkan sumber lainnya
            </Label>
            <Textarea
              id="referral_other"
              placeholder="Tuliskan dari mana Anda mengenal kami..."
              value={data.referral_other || ""}
              onChange={(e) => onChange("referral_other", e.target.value)}
              rows={2}
              className="bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
