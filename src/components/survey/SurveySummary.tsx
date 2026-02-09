import {
  SurveyData,
  REFERRAL_SOURCES,
  REGISTRATION_OPTIONS,
  SPEED_OPTIONS,
  CS_SERVICE_OPTIONS,
  TOGEL_EXPERIENCE_OPTIONS,
  SLOT_EXPERIENCE_OPTIONS,
  CASINO_EXPERIENCE_OPTIONS,
  ACCESS_OPTIONS,
  RECOMMEND_OPTIONS,
  SECURITY_OPTIONS,
  WITHDRAW_ISSUE_OPTIONS,
  CS_MEDIA_OPTIONS,
} from "@/types/survey";

interface SurveySummaryProps {
  data: Partial<SurveyData>;
}

function getLabel(options: { value: string; label: string }[], value: string | undefined): string {
  if (!value) return "-";
  return options.find((opt) => opt.value === value)?.label || value;
}

const ICONS = {
  user_id: "🧑",
  whatsapp: "📱",
  referral: "📍",
  registration: "📋",
  deposit: "💰",
  withdraw: "💸",
  cs: "🎧",
  togel: "🎯",
  slot: "🎰",
  casino: "🃏",
  access: "🔗",
  recommend: "⭐",
  security: "🔒",
  withdraw_issue: "⚠️",
  media: "💬",
  suggestions: "📝",
};

export function SurveySummary({ data }: SurveySummaryProps) {
  const rows = [
    { icon: ICONS.user_id, label: "Userid", value: data.user_id },
    { icon: ICONS.whatsapp, label: "WhatsApp", value: data.whatsapp },
    { icon: ICONS.referral, label: "Tahu dari", value: getLabel(REFERRAL_SOURCES, data.referral_source) },
    { icon: ICONS.registration, label: "Pendaftaran", value: getLabel(REGISTRATION_OPTIONS, data.registration_ease) },
    { icon: ICONS.deposit, label: "Deposit", value: getLabel(SPEED_OPTIONS, data.deposit_speed) },
    { icon: ICONS.withdraw, label: "Withdraw", value: getLabel(SPEED_OPTIONS, data.withdraw_speed) },
    { icon: ICONS.cs, label: "Pelayanan CS", value: getLabel(CS_SERVICE_OPTIONS, data.cs_service) },
    { icon: ICONS.togel, label: "Pengalaman Togel", value: getLabel(TOGEL_EXPERIENCE_OPTIONS, data.togel_experience) },
    { icon: ICONS.slot, label: "Pengalaman Slot", value: getLabel(SLOT_EXPERIENCE_OPTIONS, data.slot_experience) },
    { icon: ICONS.casino, label: "Pengalaman Casino", value: getLabel(CASINO_EXPERIENCE_OPTIONS, data.casino_experience) },
    { icon: ICONS.access, label: "Kemudahan Akses", value: getLabel(ACCESS_OPTIONS, data.access_ease) },
    { icon: ICONS.recommend, label: "Rekomendasi", value: getLabel(RECOMMEND_OPTIONS, data.would_recommend) },
    { icon: ICONS.security, label: "Keamanan Data", value: getLabel(SECURITY_OPTIONS, data.data_security) },
    { icon: ICONS.withdraw_issue, label: "Kendala Withdraw", value: getLabel(WITHDRAW_ISSUE_OPTIONS, data.withdraw_issue) },
    { icon: ICONS.media, label: "Media Komunikasi", value: getLabel(CS_MEDIA_OPTIONS, data.preferred_cs_media) },
    ...(data.suggestions ? [{ icon: ICONS.suggestions, label: "Saran & Masukan", value: data.suggestions }] : []),
  ];

  return (
    <div className="bg-card rounded-lg p-5 animate-slide-up">
      <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
        📋 Ringkasan Jawaban Anda
      </h3>
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <span className="text-sm flex-shrink-0 w-5 text-center">{row.icon}</span>
            <span className="text-sm text-muted-foreground min-w-[140px] flex-shrink-0">{row.label}</span>
            <span className="text-sm font-bold text-foreground">{row.value || "-"}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>☑️ Pastikan semua data sudah benar sebelum mengirim.</p>
        <p>Anda masih bisa kembali untuk mengubah jawaban.</p>
      </div>
    </div>
  );
}
