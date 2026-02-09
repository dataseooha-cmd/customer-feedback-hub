import { QuestionGroup } from "./QuestionGroup";
import {
  SurveyData,
  REGISTRATION_OPTIONS,
  SPEED_OPTIONS,
  CS_SERVICE_OPTIONS,
  TOGEL_EXPERIENCE_OPTIONS,
  SLOT_EXPERIENCE_OPTIONS,
  CASINO_EXPERIENCE_OPTIONS,
  ACCESS_OPTIONS,
} from "@/types/survey";

interface Step2ServiceProps {
  data: Partial<SurveyData>;
  onChange: (field: keyof SurveyData, value: string) => void;
  siteName: string;
  errors: Record<string, string>;
}

export function Step2Service({ data, onChange, siteName, errors }: Step2ServiceProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Penilaian Layanan Utama */}
      <div className="bg-card rounded-lg p-5 space-y-5">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          ⭐ Penilaian Layanan Utama
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <QuestionGroup
            question="Bagaimana kemudahan proses pendaftaran akun?"
            name="registration_ease"
            options={REGISTRATION_OPTIONS}
            value={data.registration_ease || ""}
            onChange={(v) => onChange("registration_ease", v)}
            error={errors.registration_ease}
          />
          <QuestionGroup
            question="Bagaimana kecepatan proses transaksi Deposit?"
            name="deposit_speed"
            options={SPEED_OPTIONS}
            value={data.deposit_speed || ""}
            onChange={(v) => onChange("deposit_speed", v)}
            error={errors.deposit_speed}
          />
          <QuestionGroup
            question="Bagaimana kecepatan proses transaksi Withdraw?"
            name="withdraw_speed"
            options={SPEED_OPTIONS}
            value={data.withdraw_speed || ""}
            onChange={(v) => onChange("withdraw_speed", v)}
            error={errors.withdraw_speed}
          />
          <QuestionGroup
            question={`Bagaimana pelayanan CS ${siteName}?`}
            name="cs_service"
            options={CS_SERVICE_OPTIONS}
            value={data.cs_service || ""}
            onChange={(v) => onChange("cs_service", v)}
            error={errors.cs_service}
          />
        </div>
      </div>

      {/* Pengalaman Bermain */}
      <div className="bg-card rounded-lg p-5 space-y-5">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          🎮 Pengalaman Bermain
        </h3>
        <div className="space-y-5">
          <QuestionGroup
            question={`Bagaimana pengalaman bermain togel di ${siteName}?`}
            name="togel_experience"
            options={TOGEL_EXPERIENCE_OPTIONS}
            value={data.togel_experience || ""}
            onChange={(v) => onChange("togel_experience", v)}
            error={errors.togel_experience}
          />
          <QuestionGroup
            question={`Bagaimana pengalaman bermain slot di ${siteName}?`}
            name="slot_experience"
            options={SLOT_EXPERIENCE_OPTIONS}
            value={data.slot_experience || ""}
            onChange={(v) => onChange("slot_experience", v)}
            error={errors.slot_experience}
          />
          <QuestionGroup
            question={`Bagaimana pengalaman bermain casino di ${siteName}?`}
            name="casino_experience"
            options={CASINO_EXPERIENCE_OPTIONS}
            value={data.casino_experience || ""}
            onChange={(v) => onChange("casino_experience", v)}
            error={errors.casino_experience}
          />
          <QuestionGroup
            question={`Bagaimana kemudahan akses link / permainan ${siteName}?`}
            name="access_ease"
            options={ACCESS_OPTIONS}
            value={data.access_ease || ""}
            onChange={(v) => onChange("access_ease", v)}
            error={errors.access_ease}
          />
        </div>
      </div>
    </div>
  );
}
