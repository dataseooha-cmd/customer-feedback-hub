-- Create table for survey responses
CREATE TABLE public.responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Step 1: Identitas Responden
    user_id TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    referral_source TEXT NOT NULL,
    referral_other TEXT,
    
    -- Step 2: Penilaian Layanan Utama
    registration_ease TEXT NOT NULL,
    deposit_speed TEXT NOT NULL,
    withdraw_speed TEXT NOT NULL,
    cs_service TEXT NOT NULL,
    
    -- Pengalaman Bermain
    togel_experience TEXT NOT NULL,
    slot_experience TEXT NOT NULL,
    casino_experience TEXT NOT NULL,
    access_ease TEXT NOT NULL,
    
    -- Step 3: Feedback & Rekomendasi
    would_recommend TEXT NOT NULL,
    data_security TEXT NOT NULL,
    withdraw_issue TEXT NOT NULL,
    preferred_cs_media TEXT NOT NULL,
    
    -- Penilaian Keseluruhan
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    
    -- Saran & Masukan
    suggestions TEXT
);

-- Enable RLS
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert responses (public survey)
CREATE POLICY "Anyone can submit survey responses"
ON public.responses
FOR INSERT
WITH CHECK (true);

-- Create table for site settings
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_name TEXT NOT NULL DEFAULT 'SurveyApp',
    site_title TEXT NOT NULL DEFAULT 'Survei Kepuasan Pelanggan',
    site_description TEXT NOT NULL DEFAULT 'Berikan feedback Anda untuk membantu kami meningkatkan layanan',
    logo_url TEXT,
    favicon_url TEXT,
    background_color TEXT DEFAULT '#f8fafc',
    cs_contact TEXT DEFAULT 'https://wa.me/62812345678',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Insert default settings
INSERT INTO public.site_settings (site_name, site_title, site_description)
VALUES ('SurveyApp', 'Survei Kepuasan Pelanggan', 'Berikan feedback Anda untuk membantu kami meningkatkan layanan');

-- Create profiles table for admin users
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Only admins can view responses
CREATE POLICY "Admins can view all responses"
ON public.responses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view their own role
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();