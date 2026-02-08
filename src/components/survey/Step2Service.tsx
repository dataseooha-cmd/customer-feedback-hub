import { QuestionGroup } from "./QuestionGroup";
import { SurveyData, REGISTRATION_OPTIONS, SPEED_OPTIONS, CS_SERVICE_OPTIONS, EXPERIENCE_OPTIONS, ACCESS_OPTIONS } from "@/types/survey";

interface Step2ServiceProps {
  data: Partial<SurveyData>;
  onChange: (field: keyof SurveyData, value: string) => void;
  siteName: string;
  errors: Record<string, string>;
}

export function Step2Service({ data, onChange, siteName, errors }: Step2ServiceProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Penilaian Layanan
        </h2>
        <p className="text-muted-foreground">
          Berikan penilaian Anda terhadap layanan {siteName}
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">
            Layanan Utama
          </h3>
          <div className="space-y-6">
            <div>
              <QuestionGroup
                question="Bagaimana kemudahan proses pendaftaran akun?"
                name="registration_ease"
                options={REGISTRATION_OPTIONS}
                value={data.registration_ease || ""}
                onChange={(value) => onChange("registration_ease", value)}
                siteName={siteName}
              />
              {errors.registration_ease && (
                <p className="text-sm text-destructive mt-2">{errors.registration_ease}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question="Bagaimana kecepatan proses transaksi deposit?"
                name="deposit_speed"
                options={SPEED_OPTIONS}
                value={data.deposit_speed || ""}
                onChange={(value) => onChange("deposit_speed", value)}
                siteName={siteName}
              />
              {errors.deposit_speed && (
                <p className="text-sm text-destructive mt-2">{errors.deposit_speed}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question="Bagaimana kecepatan proses transaksi withdraw?"
                name="withdraw_speed"
                options={SPEED_OPTIONS}
                value={data.withdraw_speed || ""}
                onChange={(value) => onChange("withdraw_speed", value)}
                siteName={siteName}
              />
              {errors.withdraw_speed && (
                <p className="text-sm text-destructive mt-2">{errors.withdraw_speed}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question={`Bagaimana pelayanan CS ${siteName}?`}
                name="cs_service"
                options={CS_SERVICE_OPTIONS}
                value={data.cs_service || ""}
                onChange={(value) => onChange("cs_service", value)}
                siteName={siteName}
              />
              {errors.cs_service && (
                <p className="text-sm text-destructive mt-2">{errors.cs_service}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">
            Pengalaman Bermain
          </h3>
          <div className="space-y-6">
            <div>
              <QuestionGroup
                question={`Bagaimana pengalaman bermain togel di ${siteName}?`}
                name="togel_experience"
                options={EXPERIENCE_OPTIONS}
                value={data.togel_experience || ""}
                onChange={(value) => onChange("togel_experience", value)}
                siteName={siteName}
              />
              {errors.togel_experience && (
                <p className="text-sm text-destructive mt-2">{errors.togel_experience}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question={`Bagaimana pengalaman bermain slot di ${siteName}?`}
                name="slot_experience"
                options={EXPERIENCE_OPTIONS}
                value={data.slot_experience || ""}
                onChange={(value) => onChange("slot_experience", value)}
                siteName={siteName}
              />
              {errors.slot_experience && (
                <p className="text-sm text-destructive mt-2">{errors.slot_experience}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question={`Bagaimana pengalaman bermain casino di ${siteName}?`}
                name="casino_experience"
                options={EXPERIENCE_OPTIONS}
                value={data.casino_experience || ""}
                onChange={(value) => onChange("casino_experience", value)}
                siteName={siteName}
              />
              {errors.casino_experience && (
                <p className="text-sm text-destructive mt-2">{errors.casino_experience}</p>
              )}
            </div>

            <div>
              <QuestionGroup
                question={`Bagaimana kemudahan akses link/permainan ${siteName}?`}
                name="access_ease"
                options={ACCESS_OPTIONS}
                value={data.access_ease || ""}
                onChange={(value) => onChange("access_ease", value)}
                siteName={siteName}
              />
              {errors.access_ease && (
                <p className="text-sm text-destructive mt-2">{errors.access_ease}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
