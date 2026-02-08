import { QuestionGroup } from "./QuestionGroup";
import { StarRating } from "./StarRating";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SurveyData, YES_NO_OPTIONS, CS_MEDIA_OPTIONS } from "@/types/survey";

interface Step3FeedbackProps {
  data: Partial<SurveyData>;
  onChange: (field: keyof SurveyData, value: string | number) => void;
  siteName: string;
  errors: Record<string, string>;
}

export function Step3Feedback({ data, onChange, siteName, errors }: Step3FeedbackProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Feedback & Rekomendasi
        </h2>
        <p className="text-muted-foreground">
          Bagikan pengalaman dan saran Anda untuk {siteName}
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-4 bg-secondary/50 rounded-lg space-y-6">
          <div>
            <QuestionGroup
              question={`Apakah kamu akan merekomendasikan ${siteName} ke rekan-rekan kamu?`}
              name="would_recommend"
              options={YES_NO_OPTIONS}
              value={data.would_recommend || ""}
              onChange={(value) => onChange("would_recommend", value)}
              siteName={siteName}
            />
            {errors.would_recommend && (
              <p className="text-sm text-destructive mt-2">{errors.would_recommend}</p>
            )}
          </div>

          <div>
            <QuestionGroup
              question={`Selama bermain, apakah bosku merasa aman dengan data yang didaftarkan di ${siteName}?`}
              name="data_security"
              options={YES_NO_OPTIONS}
              value={data.data_security || ""}
              onChange={(value) => onChange("data_security", value)}
              siteName={siteName}
            />
            {errors.data_security && (
              <p className="text-sm text-destructive mt-2">{errors.data_security}</p>
            )}
          </div>

          <div>
            <QuestionGroup
              question="Pernahkah anda mengalami kendala saat melakukan withdraw?"
              name="withdraw_issue"
              options={YES_NO_OPTIONS}
              value={data.withdraw_issue || ""}
              onChange={(value) => onChange("withdraw_issue", value)}
              siteName={siteName}
            />
            {errors.withdraw_issue && (
              <p className="text-sm text-destructive mt-2">{errors.withdraw_issue}</p>
            )}
          </div>

          <div>
            <QuestionGroup
              question={`Media apa yang paling sering bosku gunakan untuk berkomunikasi dengan CS ${siteName}?`}
              name="preferred_cs_media"
              options={CS_MEDIA_OPTIONS}
              value={data.preferred_cs_media || ""}
              onChange={(value) => onChange("preferred_cs_media", value)}
              siteName={siteName}
            />
            {errors.preferred_cs_media && (
              <p className="text-sm text-destructive mt-2">{errors.preferred_cs_media}</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground">
            Penilaian Keseluruhan <span className="text-destructive">*</span>
          </h3>
          <p className="text-muted-foreground text-sm">
            Berikan rating keseluruhan pengalaman Anda
          </p>
          <StarRating
            rating={data.overall_rating || 0}
            onChange={(value) => onChange("overall_rating", value)}
          />
          {errors.overall_rating && (
            <p className="text-sm text-destructive">{errors.overall_rating}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="suggestions" className="text-lg font-display font-semibold">
            Saran & Masukan
          </Label>
          <p className="text-muted-foreground text-sm">
            Tuliskan saran atau masukan Anda untuk membantu kami meningkatkan layanan
          </p>
          <Textarea
            id="suggestions"
            placeholder="Tuliskan saran dan masukan Anda di sini..."
            value={data.suggestions || ""}
            onChange={(e) => onChange("suggestions", e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
}
