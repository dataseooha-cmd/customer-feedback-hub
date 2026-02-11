-- Drop the CHECK constraint that blocks overall_rating = 0
ALTER TABLE public.responses DROP CONSTRAINT IF EXISTS responses_overall_rating_check;