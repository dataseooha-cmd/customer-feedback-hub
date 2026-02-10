-- Add theme color columns to site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#222222',
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#FBBF24',
ADD COLUMN IF NOT EXISTS header_color text DEFAULT '#222222',
ADD COLUMN IF NOT EXISTS progress_color text DEFAULT '#EF4444';

-- Also add a SELECT policy for anon on responses so they can read back their insert
-- This is scoped: anon can only select id and response_number, not sensitive data
-- Actually, better approach: just grant minimal select for the return
CREATE POLICY "Anyone can read response number after submit"
ON public.responses
AS PERMISSIVE
FOR SELECT
TO anon, authenticated
USING (true);

-- But wait, this exposes all responses. Let me drop this and handle it differently in code.
-- Actually no - the SELECT policy for admins already exists. The issue is that anon needs SELECT too for the insert return.
-- For security, I'll handle it in code instead by removing .select() from insert.
DROP POLICY IF EXISTS "Anyone can read response number after submit" ON public.responses;