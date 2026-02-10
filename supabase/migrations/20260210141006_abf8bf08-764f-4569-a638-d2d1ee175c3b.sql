-- Add explicit deny policies for INSERT and DELETE on profiles table
-- Profiles are created via handle_new_user() trigger (SECURITY DEFINER), not direct inserts
CREATE POLICY "Profiles created only via trigger"
ON public.profiles FOR INSERT
WITH CHECK (false);

-- Profiles should be deleted via CASCADE when auth.users is deleted
CREATE POLICY "Users cannot delete profiles"
ON public.profiles FOR DELETE
USING (false);