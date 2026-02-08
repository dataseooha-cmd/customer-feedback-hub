import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteSettings } from "@/types/survey";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full survey-gradient flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Terima Kasih!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Feedback Anda sangat berarti bagi kami. Kami akan terus meningkatkan layanan berdasarkan masukan yang Anda berikan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
          
          {siteSettings?.cs_contact && (
            <Button
              asChild
              className="gap-2 survey-gradient border-0"
            >
              <a href={siteSettings.cs_contact} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Hubungi CS
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
