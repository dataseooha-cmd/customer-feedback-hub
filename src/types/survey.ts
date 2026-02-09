export interface SurveyData {
  user_id: string;
  whatsapp: string;
  referral_source: string;
  referral_other?: string;
  registration_ease: string;
  deposit_speed: string;
  withdraw_speed: string;
  cs_service: string;
  togel_experience: string;
  slot_experience: string;
  casino_experience: string;
  access_ease: string;
  would_recommend: string;
  data_security: string;
  withdraw_issue: string;
  preferred_cs_media: string;
  overall_rating: number;
  suggestions?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_title: string;
  site_description: string;
  logo_url: string | null;
  favicon_url: string | null;
  background_color: string | null;
  background_url: string | null;
  cs_contact: string | null;
  updated_at: string;
}

export const REFERRAL_SOURCES = [
  { value: 'teman_keluarga', label: 'Teman/Keluarga/Rekan kerja' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'sms', label: 'Pesan Sms' },
  { value: 'whatsapp', label: 'Whatsapp' },
  { value: 'iklan', label: 'Iklan / Promosi' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const REGISTRATION_OPTIONS = [
  { value: 'sangat_mudah', label: 'Sangat Mudah' },
  { value: 'mudah', label: 'Mudah' },
  { value: 'sulit', label: 'Sulit' },
  { value: 'sangat_sulit', label: 'Sangat Sulit' },
];

export const SPEED_OPTIONS = [
  { value: 'sangat_cepat', label: 'Sangat Cepat' },
  { value: 'cepat', label: 'Cepat' },
  { value: 'lama', label: 'Lama' },
  { value: 'sangat_lama', label: 'Sangat Lama' },
];

export const CS_SERVICE_OPTIONS = [
  { value: 'ramah', label: 'Ramah' },
  { value: 'sangat_ramah', label: 'Sangat Ramah' },
  { value: 'buruk', label: 'Buruk' },
  { value: 'sangat_buruk', label: 'Sangat Buruk' },
];

export const TOGEL_EXPERIENCE_OPTIONS = [
  { value: 'sangat_nyaman', label: 'Sangat Nyaman' },
  { value: 'nyaman', label: 'Nyaman' },
  { value: 'tidak_nyaman', label: 'Tidak Nyaman' },
  { value: 'tidak_bermain', label: 'Tidak Bermain' },
];

export const SLOT_EXPERIENCE_OPTIONS = [
  { value: 'jackpot_terus', label: 'Jackpot Terus' },
  { value: 'lancar', label: 'Lancar Tanpa Gangguan' },
  { value: 'rungkad', label: 'Rungkad Terus' },
  { value: 'sering_gangguan', label: 'Sering Gangguan' },
  { value: 'tidak_bermain', label: 'Tidak Bermain' },
];

export const CASINO_EXPERIENCE_OPTIONS = [
  { value: 'jackpot_terus', label: 'Jackpot Terus' },
  { value: 'lancar', label: 'Lancar Tanpa Gangguan' },
  { value: 'rungkad', label: 'Rungkad Terus' },
  { value: 'sering_gangguan', label: 'Sering Gangguan' },
  { value: 'tidak_bermain', label: 'Tidak Bermain' },
];

export const ACCESS_OPTIONS = [
  { value: 'mudah_lancar', label: 'Mudah Di Akses dan Lancar' },
  { value: 'loading_cepat', label: 'Loading Cepat' },
  { value: 'sering_lambat', label: 'Sering Lambat Loading' },
  { value: 'tidak_bisa', label: 'Terkadang Tidak Bisa diakses' },
];

export const RECOMMEND_OPTIONS = [
  { value: 'pasti', label: 'Pasti' },
  { value: 'sudah', label: 'Sudah' },
  { value: 'belum_tahu', label: 'Belum Tahu' },
  { value: 'tidak_akan', label: 'Tidak akan' },
];

export const SECURITY_OPTIONS = [
  { value: 'aman', label: 'Aman' },
  { value: 'sangat_aman', label: 'Sangat Aman' },
  { value: 'tidak_aman', label: 'Tidak Aman' },
  { value: 'sangat_tidak_aman', label: 'Sangat Tidak Aman' },
];

export const WITHDRAW_ISSUE_OPTIONS = [
  { value: 'tidak_ada', label: 'Tidak Ada Kendala' },
  { value: 'rekening_invalid', label: 'Rekening tidak valid' },
  { value: 'sering_pending', label: 'Withdraw sering pending' },
  { value: 'lama_proses', label: 'Lama proses Withdraw' },
];

export const CS_MEDIA_OPTIONS = [
  { value: 'whatsapp', label: 'Whatsapp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'livechat', label: 'Livechat' },
  { value: 'instagram', label: 'Instagram' },
];

// Keep legacy exports for backward compat
export const EXPERIENCE_OPTIONS = TOGEL_EXPERIENCE_OPTIONS;
export const YES_NO_OPTIONS = RECOMMEND_OPTIONS;
