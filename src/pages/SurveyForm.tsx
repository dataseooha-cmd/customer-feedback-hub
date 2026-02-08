import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/survey/ProgressStepper";
import { SurveyCard } from "@/components/survey/SurveyCard";
import { Step1Identity } from "@/components/survey/Step1Identity";
import { Step2Service } from "@/components/survey/Step2Service";
import { Step3Feedback } from "@/components/survey/Step3Feedback";
import { SurveySummary } from "@/components/survey/SurveySummary";
import { SurveyData, SiteSettings } from "@/types/survey";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Send, Eye, Loader2 } from "lucide-react";

const STEPS = ["Identitas", "Penilaian", "Feedback", "Ringkasan"];

export default function SurveyForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Partial<SurveyData>>({
    overall_rating: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    
    if (settings) {
      setSiteSettings(settings as SiteSettings);
    }
  };

  const siteName = siteSettings?.site_name || "Kami";

  const handleChange = (field: keyof SurveyData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!data.user_id?.trim()) {
      newErrors.user_id = "User ID wajib diisi";
    }
    if (!data.whatsapp?.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(data.whatsapp)) {
      newErrors.whatsapp = "Format nomor WhatsApp tidak valid";
    }
    if (!data.referral_source) {
      newErrors.referral_source = "Pilih salah satu sumber";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = [
      "registration_ease",
      "deposit_speed",
      "withdraw_speed",
      "cs_service",
      "togel_experience",
      "slot_experience",
      "casino_experience",
      "access_ease",
    ];

    fields.forEach((field) => {
      if (!data[field as keyof SurveyData]) {
        newErrors[field] = "Wajib dipilih";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = ["would_recommend", "data_security", "withdraw_issue", "preferred_cs_media"];

    fields.forEach((field) => {
      if (!data[field as keyof SurveyData]) {
        newErrors[field] = "Wajib dipilih";
      }
    });

    if (!data.overall_rating || data.overall_rating === 0) {
      newErrors.overall_rating = "Rating wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep === 3) {
        setShowSummary(true);
        setCurrentStep(4);
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const handlePrev = () => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentStep(3);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("responses").insert({
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
        overall_rating: data.overall_rating,
        suggestions: data.suggestions || null,
      });

      if (error) throw error;

      toast.success("Terima kasih! Survei berhasil dikirim");
      navigate("/success");
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      toast.error("Gagal mengirim survei. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold survey-gradient-text mb-2">
            {siteSettings?.site_title || "Survei Kepuasan Pelanggan"}
          </h1>
          <p className="text-muted-foreground">
            {siteSettings?.site_description || "Berikan feedback untuk membantu kami meningkatkan layanan"}
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} totalSteps={4} steps={STEPS} />

        <SurveyCard>
          {currentStep === 1 && !showSummary && (
            <Step1Identity
              data={data}
              onChange={handleChange}
              siteName={siteName}
              errors={errors}
            />
          )}
          {currentStep === 2 && !showSummary && (
            <Step2Service
              data={data}
              onChange={handleChange}
              siteName={siteName}
              errors={errors}
            />
          )}
          {currentStep === 3 && !showSummary && (
            <Step3Feedback
              data={data}
              onChange={handleChange}
              siteName={siteName}
              errors={errors}
            />
          )}
          {showSummary && (
            <SurveySummary data={data} siteName={siteName} />
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 && !showSummary}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </Button>

            {!showSummary ? (
              <Button onClick={handleNext} className="gap-2 survey-gradient border-0">
                {currentStep === 3 ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Lihat Ringkasan
                  </>
                ) : (
                  <>
                    Lanjut
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 survey-gradient border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Survei
                  </>
                )}
              </Button>
            )}
          </div>
        </SurveyCard>

        {siteSettings?.cs_contact && (
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Butuh bantuan?{" "}
              <a
                href={siteSettings.cs_contact}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Hubungi CS
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
