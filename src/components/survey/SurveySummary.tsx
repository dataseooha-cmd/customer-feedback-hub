import { SurveyData, REFERRAL_SOURCES, REGISTRATION_OPTIONS, SPEED_OPTIONS, CS_SERVICE_OPTIONS, EXPERIENCE_OPTIONS, ACCESS_OPTIONS, YES_NO_OPTIONS, CS_MEDIA_OPTIONS } from "@/types/survey";
import { Star, CheckCircle } from "lucide-react";

interface SurveySummaryProps {
  data: Partial<SurveyData>;
  siteName: string;
}

function getLabel(options: { value: string; label: string }[], value: string | undefined): string {
  if (!value) return "-";
  return options.find((opt) => opt.value === value)?.label || value;
}

export function SurveySummary({ data, siteName }: SurveySummaryProps) {
  const sections = [
    {
      title: "Identitas Responden",
      items: [
        { label: "User ID", value: data.user_id },
        { label: "WhatsApp", value: data.whatsapp },
        { label: `Kenal ${siteName} dari`, value: getLabel(REFERRAL_SOURCES, data.referral_source) },
        ...(data.referral_source === "lainnya" ? [{ label: "Sumber Lainnya", value: data.referral_other }] : []),
      ],
    },
    {
      title: "Penilaian Layanan Utama",
      items: [
        { label: "Kemudahan Pendaftaran", value: getLabel(REGISTRATION_OPTIONS, data.registration_ease) },
        { label: "Kecepatan Deposit", value: getLabel(SPEED_OPTIONS, data.deposit_speed) },
        { label: "Kecepatan Withdraw", value: getLabel(SPEED_OPTIONS, data.withdraw_speed) },
        { label: "Pelayanan CS", value: getLabel(CS_SERVICE_OPTIONS, data.cs_service) },
      ],
    },
    {
      title: "Pengalaman Bermain",
      items: [
        { label: "Togel", value: getLabel(EXPERIENCE_OPTIONS, data.togel_experience) },
        { label: "Slot", value: getLabel(EXPERIENCE_OPTIONS, data.slot_experience) },
        { label: "Casino", value: getLabel(EXPERIENCE_OPTIONS, data.casino_experience) },
        { label: "Akses Link/Permainan", value: getLabel(ACCESS_OPTIONS, data.access_ease) },
      ],
    },
    {
      title: "Feedback & Rekomendasi",
      items: [
        { label: "Akan Merekomendasikan", value: getLabel(YES_NO_OPTIONS, data.would_recommend) },
        { label: "Merasa Aman dengan Data", value: getLabel(YES_NO_OPTIONS, data.data_security) },
        { label: "Pernah Kendala Withdraw", value: getLabel(YES_NO_OPTIONS, data.withdraw_issue) },
        { label: "Media CS Favorit", value: getLabel(CS_MEDIA_OPTIONS, data.preferred_cs_media) },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full survey-gradient flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Ringkasan Jawaban
        </h2>
        <p className="text-muted-foreground">
          Periksa kembali jawaban Anda sebelum submit
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-lg font-display font-semibold text-foreground mb-3">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-lg font-display font-semibold text-foreground mb-3">
            Penilaian Keseluruhan
          </h3>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= (data.overall_rating || 0)
                    ? "fill-survey-star text-survey-star"
                    : "fill-transparent text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-2 text-lg font-semibold">{data.overall_rating || 0}/5</span>
          </div>
        </div>

        {data.suggestions && (
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="text-lg font-display font-semibold text-foreground mb-3">
              Saran & Masukan
            </h3>
            <p className="text-foreground whitespace-pre-wrap">{data.suggestions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
