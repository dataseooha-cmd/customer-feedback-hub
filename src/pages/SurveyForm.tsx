import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/survey/ProgressStepper";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyFooter } from "@/components/survey/SurveyFooter";
import { Step1Identity } from "@/components/survey/Step1Identity";
import { Step2Service } from "@/components/survey/Step2Service";
import { Step3Feedback } from "@/components/survey/Step3Feedback";
import { SurveySummary } from "@/components/survey/SurveySummary";
import { SurveyData, SiteSettings } from "@/types/survey";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send, Eye, Loader2 } from "lucide-react";

export default function SurveyForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Partial<SurveyData>>({ overall_rating: 0 });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    if (settings) setSiteSettings(settings as unknown as SiteSettings);
  };

  const siteName = siteSettings?.site_name || "Kami";

  const handleChange = (field: keyof SurveyData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.user_id?.trim()) e.user_id = "User ID wajib diisi";
    if (!data.whatsapp?.trim()) e.whatsapp = "Nomor WhatsApp wajib diisi";
    else if (!/^[0-9+\-\s()]+$/.test(data.whatsapp)) e.whatsapp = "Format nomor WhatsApp tidak valid";
    if (!data.referral_source) e.referral_source = "Pilih salah satu sumber";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    const fields = ["registration_ease", "deposit_speed", "withdraw_speed", "cs_service", "togel_experience", "slot_experience", "casino_experience", "access_ease"];
    fields.forEach((f) => { if (!data[f as keyof SurveyData]) e[f] = "Wajib dipilih"; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    const fields = ["would_recommend", "data_security", "withdraw_issue", "preferred_cs_media"];
    fields.forEach((f) => { if (!data[f as keyof SurveyData]) e[f] = "Wajib dipilih"; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (currentStep === 1) valid = validateStep1();
    else if (currentStep === 2) valid = validateStep2();
    else valid = true;

    if (valid && currentStep < 3) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!valid) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    setShowSummary(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.from("responses").insert({
        user_id: data.user_id,
        whatsapp: data.whatsapp,
        referral_source: data.referral_source,
        referral_other: data.referral_other || null,
        registration_ease: data.registration_ease,
        deposit_speed: data.deposit_speed,
        withdraw_speed: data.withdraw_speed,
        cs_service: data.cs_service,
        togel_experience: data.togel_experience,
        slot_experience: data.slot_experience,
        casino_experience: data.casino_experience,
        access_ease: data.access_ease,
        would_recommend: data.would_recommend,
        data_security: data.data_security,
        withdraw_issue: data.withdraw_issue,
        preferred_cs_media: data.preferred_cs_media,
        overall_rating: data.overall_rating || 0,
        suggestions: data.suggestions || null,
      }).select("response_number").single();

      if (error) throw error;

      navigate("/success", {
        state: {
          created_at: new Date().toISOString(),
          response_number: result?.response_number,
        },
      });
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error submitting survey:", error);
      
      // User-friendly error messages
      const msg = error?.message || "";
      if (msg.includes("already submitted")) {
        toast.error("User ID ini sudah mengisi survei hari ini. Silakan coba lagi besok.");
      } else {
        toast.error("Gagal mengirim survei. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic background
  const bgStyle: React.CSSProperties = {};
  if (siteSettings?.background_url) {
    bgStyle.backgroundImage = `url(${siteSettings.background_url})`;
    bgStyle.backgroundSize = "cover";
    bgStyle.backgroundPosition = "center";
    bgStyle.backgroundRepeat = "no-repeat";
  } else if (siteSettings?.background_color) {
    bgStyle.background = siteSettings.background_color;
  }

  return (
    <div className="min-h-screen survey-bg py-6 px-4" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <SurveyHeader settings={siteSettings} />
          <div className="px-6 pt-4">
            <ProgressStepper currentStep={currentStep} totalSteps={3} progressColor={siteSettings?.progress_color} />
          </div>

          <div className="px-6 py-4 space-y-4">
            {currentStep === 1 && (
              <Step1Identity data={data} onChange={handleChange} siteName={siteName} errors={errors} />
            )}
            {currentStep === 2 && (
              <Step2Service data={data} onChange={handleChange} siteName={siteName} errors={errors} />
            )}
            {currentStep === 3 && (
              <>
                <Step3Feedback data={data} onChange={handleChange} siteName={siteName} errors={errors} />
                {showSummary && <SurveySummary data={data} />}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrev} className="gap-1.5 text-sm">
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button onClick={handleNext} className="gap-1.5 text-sm" style={{ background: siteSettings?.primary_color || undefined, color: '#fff' }}>
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSummary(!showSummary)}
                  className="text-sm font-medium text-foreground hover:underline flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Ringkasan
                </button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-1.5 text-sm"
                  style={{ background: siteSettings?.primary_color || undefined, color: '#fff' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Jawaban
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <SurveyFooter settings={siteSettings} />
      </div>
    </div>
  );
}
