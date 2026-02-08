export interface SurveyData {
  // Step 1: Identitas Responden
  user_id: string;
  whatsapp: string;
  referral_source: string;
  referral_other?: string;

  // Step 2: Penilaian Layanan Utama
  registration_ease: string;
  deposit_speed: string;
  withdraw_speed: string;
  cs_service: string;

  // Pengalaman Bermain
  togel_experience: string;
  slot_experience: string;
  casino_experience: string;
  access_ease: string;

  // Step 3: Feedback & Rekomendasi
  would_recommend: string;
  data_security: string;
  withdraw_issue: string;
  preferred_cs_media: string;

  // Penilaian Keseluruhan
  overall_rating: number;

  // Saran & Masukan
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
  cs_contact: string | null;
  updated_at: string;
}

export const REFERRAL_SOURCES = [
  { value: 'teman_keluarga', label: 'Teman/Keluarga/Rekan Kerja' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'sms', label: 'Pesan SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'iklan', label: 'Iklan/Promosi' },
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
  { value: 'sangat_ramah', label: 'Sangat Ramah' },
  { value: 'ramah', label: 'Ramah' },
  { value: 'buruk', label: 'Buruk' },
  { value: 'sangat_buruk', label: 'Sangat Buruk' },
];

export const EXPERIENCE_OPTIONS = [
  { value: 'sangat_baik', label: 'Sangat Baik' },
  { value: 'baik', label: 'Baik' },
  { value: 'buruk', label: 'Buruk' },
  { value: 'sangat_buruk', label: 'Sangat Buruk' },
];

export const ACCESS_OPTIONS = [
  { value: 'sangat_mudah', label: 'Sangat Mudah' },
  { value: 'mudah', label: 'Mudah' },
  { value: 'sulit', label: 'Sulit' },
  { value: 'sangat_sulit', label: 'Sangat Sulit' },
];

export const YES_NO_OPTIONS = [
  { value: 'ya', label: 'Ya' },
  { value: 'tidak', label: 'Tidak' },
];

export const CS_MEDIA_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'livechat', label: 'Live Chat' },
  { value: 'email', label: 'Email' },
];
