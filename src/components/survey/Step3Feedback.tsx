import { QuestionGroup } from "./QuestionGroup";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SurveyData,
  RECOMMEND_OPTIONS,
  SECURITY_OPTIONS,
  WITHDRAW_ISSUE_OPTIONS,
  CS_MEDIA_OPTIONS,
} from "@/types/survey";

interface Step3FeedbackProps {
  data: Partial<SurveyData>;
  onChange: (field: keyof SurveyData, value: string | number) => void;
  siteName: string;
  errors: Record<string, string>;
}

export function Step3Feedback({ data, onChange, siteName, errors }: Step3FeedbackProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Feedback & Rekomendasi */}
      <div className="bg-card rounded-lg p-5 space-y-5">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          💬 Feedback & Rekomendasi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QuestionGroup
            question={`Apakah Kamu akan merekomendasikan ${siteName} ke rekan-rekan Kamu?`}
            name="would_recommend"
            options={RECOMMEND_OPTIONS}
            value={data.would_recommend || ""}
            onChange={(v) => onChange("would_recommend", v)}
            error={errors.would_recommend}
          />
          <QuestionGroup
            question={`Selama bermain apakah bosku merasa aman dengan data bosku yang anda daftarkan di ${siteName}?`}
            name="data_security"
            options={SECURITY_OPTIONS}
            value={data.data_security || ""}
            onChange={(v) => onChange("data_security", v)}
            error={errors.data_security}
          />
          <QuestionGroup
            question="Pernahkah Anda mengalami kendala saat melakukan withdraw?"
            name="withdraw_issue"
            options={WITHDRAW_ISSUE_OPTIONS}
            value={data.withdraw_issue || ""}
            onChange={(v) => onChange("withdraw_issue", v)}
            error={errors.withdraw_issue}
          />
          <QuestionGroup
            question={`Media Apa yang paling sering bosku gunakan untuk berkomunikasi dengan CS ${siteName}?`}
            name="preferred_cs_media"
            options={CS_MEDIA_OPTIONS}
            value={data.preferred_cs_media || ""}
            onChange={(v) => onChange("preferred_cs_media", v)}
            error={errors.preferred_cs_media}
          />
        </div>
      </div>

      {/* Saran & Masukan */}
      <div className="bg-card rounded-lg p-5 space-y-3">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          📝 Saran & Masukan
        </h3>
        <p className="text-sm text-muted-foreground">
          Tuliskan saran terbaik Anda untuk meningkatkan kualitas layanan kami
        </p>
        <Textarea
          id="suggestions"
          placeholder="Tulis saran dan masukan Anda di sini..."
          value={data.suggestions || ""}
          onChange={(e) => onChange("suggestions", e.target.value)}
          rows={4}
          className="resize-none bg-white border-border"
        />
        <p className="text-xs text-muted-foreground">
          Saran Anda sangat berharga untuk perbaikan layanan {siteName}.
        </p>
      </div>
    </div>
  );
}
