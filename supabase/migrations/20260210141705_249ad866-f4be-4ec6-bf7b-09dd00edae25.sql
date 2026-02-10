-- Drop the restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can submit survey responses" ON public.responses;

CREATE POLICY "Anyone can submit survey responses"
ON public.responses
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);