-- Fix: Drop ALL existing policies on responses and recreate properly as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit survey responses" ON public.responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON public.responses;

-- Recreate as PERMISSIVE (critical - without at least one PERMISSIVE policy, access is denied)
CREATE POLICY "Anyone can submit survey responses"
ON public.responses
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all responses"
ON public.responses
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also fix profiles policies to be PERMISSIVE where needed
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles created only via trigger" ON public.profiles;
DROP POLICY IF EXISTS "Users cannot delete profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Profiles created only via trigger"
ON public.profiles AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Users cannot delete profiles"
ON public.profiles AS RESTRICTIVE FOR DELETE TO authenticated
USING (false);

-- Fix site_settings policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;

CREATE POLICY "Anyone can view site settings"
ON public.site_settings AS PERMISSIVE FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can update site settings"
ON public.site_settings AS PERMISSIVE FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated
USING (auth.uid() = user_id);