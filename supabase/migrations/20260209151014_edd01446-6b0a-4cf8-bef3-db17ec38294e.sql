
-- Add auto-increment response number
ALTER TABLE public.responses ADD COLUMN response_number SERIAL;

-- Make overall_rating default to 0 (no star rating in new UI)
ALTER TABLE public.responses ALTER COLUMN overall_rating SET DEFAULT 0;

-- Add background_url column to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS background_url text;

-- Create storage bucket for site assets (logo, favicon, background)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Storage policies
CREATE POLICY "Anyone can view site assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admins can upload site assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site assets" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site assets" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
