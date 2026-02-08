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
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Identitas Responden
        </h2>
        <p className="text-muted-foreground">
          Lengkapi data diri Anda untuk melanjutkan survei
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user_id" className="text-base font-medium">
            User ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="user_id"
            placeholder="Masukkan User ID Anda"
            value={data.user_id || ""}
            onChange={(e) => onChange("user_id", e.target.value)}
            className={errors.user_id ? "border-destructive" : ""}
          />
          {errors.user_id && (
            <p className="text-sm text-destructive">{errors.user_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-base font-medium">
            Nomor WhatsApp <span className="text-destructive">*</span>
          </Label>
          <Input
            id="whatsapp"
            placeholder="Contoh: 08123456789"
            value={data.whatsapp || ""}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            className={errors.whatsapp ? "border-destructive" : ""}
          />
          {errors.whatsapp && (
            <p className="text-sm text-destructive">{errors.whatsapp}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">
            Kenal {siteName} dari mana? <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          {errors.referral_source && (
            <p className="text-sm text-destructive">{errors.referral_source}</p>
          )}
        </div>

        {data.referral_source === "lainnya" && (
          <div className="space-y-2 animate-slide-up">
            <Label htmlFor="referral_other" className="text-base font-medium">
              Sebutkan sumber lainnya
            </Label>
            <Textarea
              id="referral_other"
              placeholder="Tuliskan dari mana Anda mengenal kami..."
              value={data.referral_other || ""}
              onChange={(e) => onChange("referral_other", e.target.value)}
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}
