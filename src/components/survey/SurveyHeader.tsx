import { SiteSettings } from "@/types/survey";

interface SurveyHeaderProps {
  settings: SiteSettings | null;
}

export function SurveyHeader({ settings }: SurveyHeaderProps) {
  const siteName = settings?.site_name || "Survey";
  const siteTitle = settings?.site_title || "Penilaian Layanan Pelanggan";
  const siteDescription = settings?.site_description || "Mohon luangkan waktu sebentar untuk mengisi survei berikut.";

  const headerBg = settings?.header_color || undefined;

  return (
    <div
      className="text-white px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl flex items-start gap-3 sm:gap-4 survey-header-bg"
      style={headerBg ? { background: headerBg } : undefined}
    >
      {settings?.logo_url && (
        <img
          src={settings.logo_url}
          alt={siteName}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold leading-tight">
          {siteTitle}
        </h1>
        <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
          {`${siteName} selalu berupaya mengutamakan layanan terpadu bagi member setia. ${siteDescription}`}
        </p>
      </div>
    </div>
  );
}
