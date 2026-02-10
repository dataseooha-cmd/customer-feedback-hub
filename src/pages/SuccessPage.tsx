import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteSettings } from "@/types/survey";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyFooter } from "@/components/survey/SurveyFooter";
import { ProgressStepper } from "@/components/survey/ProgressStepper";
import { RefreshCw, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const createdAt = location.state?.created_at;

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

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleString("sv-SE").replace("T", " ")
    : new Date().toLocaleString("sv-SE").replace("T", " ");

  const bgStyle: React.CSSProperties = {};
  if (siteSettings?.background_url) {
    bgStyle.backgroundImage = `url(${siteSettings.background_url})`;
    bgStyle.backgroundSize = "cover";
    bgStyle.backgroundPosition = "center";
  } else if (siteSettings?.background_color) {
    bgStyle.background = siteSettings.background_color;
  }

  return (
    <div className="min-h-screen survey-bg py-6 px-4" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <SurveyHeader settings={siteSettings} />
          <div className="px-6 pt-4">
            <ProgressStepper currentStep={3} totalSteps={3} />
          </div>

          <div className="px-6 py-8">
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold text-emerald-600">🎉 Terima kasih!</p>
              <p className="font-semibold text-foreground">
                Survei Anda telah berhasil dikirim dan tersimpan dengan aman.
              </p>
              <p className="text-sm text-muted-foreground">
                Kami sangat menghargai waktu dan masukan Anda untuk meningkatkan kualitas layanan {siteName}.
              </p>

              {/* Response info */}
              <div className="bg-secondary rounded-lg py-4 px-6 inline-block mx-auto">
                <p className="text-sm text-foreground">
                  ⏰ Waktu: <strong>{formattedTime}</strong>
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Anda dapat menutup halaman ini sekarang atau mengisi survei lagi untuk member lain.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="gap-1.5 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Isi Survei Lagi
                </Button>
                <Button
                  onClick={() => window.close()}
                  className="gap-1.5 text-sm bg-foreground text-background hover:bg-foreground/90"
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesai
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SurveyFooter settings={siteSettings} />
      </div>
    </div>
  );
}
