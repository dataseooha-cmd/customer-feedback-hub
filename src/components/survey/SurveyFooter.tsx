import { SiteSettings } from "@/types/survey";

interface SurveyFooterProps {
  settings: SiteSettings | null;
}

export function SurveyFooter({ settings }: SurveyFooterProps) {
  const siteName = settings?.site_name || "Survey";
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-between px-4 py-4 text-xs text-foreground/60 max-w-3xl mx-auto w-full">
      <span>© {year} {siteName} • Semua hak dilindungi.</span>
      {settings?.cs_contact && (
        <span>
          Butuh bantuan?{" "}
          <a
            href={settings.cs_contact}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:underline"
          >
            Hubungi CS
          </a>
        </span>
      )}
    </footer>
  );
}
