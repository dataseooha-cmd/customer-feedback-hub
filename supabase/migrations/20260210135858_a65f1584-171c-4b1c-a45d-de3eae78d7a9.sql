
-- 1. Add length constraints to text columns
ALTER TABLE public.responses
  ALTER COLUMN user_id TYPE varchar(100),
  ALTER COLUMN whatsapp TYPE varchar(30),
  ALTER COLUMN referral_other TYPE varchar(500),
  ALTER COLUMN suggestions TYPE varchar(2000);

-- 2. Create validation trigger for responses
CREATE OR REPLACE FUNCTION public.validate_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _existing_count int;
BEGIN
  -- Validate whatsapp format
  IF NEW.whatsapp !~ '^[0-9+\-\s()]{6,30}$' THEN
    RAISE EXCEPTION 'Invalid WhatsApp number format';
  END IF;

  -- Validate user_id not empty and reasonable length
  IF length(trim(NEW.user_id)) < 1 OR length(NEW.user_id) > 100 THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  -- Rate limit: 1 submission per user_id per day
  SELECT count(*) INTO _existing_count
  FROM public.responses
  WHERE user_id = NEW.user_id
    AND created_at >= date_trunc('day', now())
    AND created_at < date_trunc('day', now()) + interval '1 day';

  IF _existing_count > 0 THEN
    RAISE EXCEPTION 'User has already submitted a survey today';
  END IF;

  -- Validate choice fields against allowed values
  IF NEW.referral_source NOT IN ('teman_keluarga','instagram','facebook','google','telegram','sms','whatsapp','iklan','lainnya') THEN
    RAISE EXCEPTION 'Invalid referral_source value';
  END IF;

  IF NEW.registration_ease NOT IN ('sangat_mudah','mudah','sulit','sangat_sulit') THEN
    RAISE EXCEPTION 'Invalid registration_ease value';
  END IF;

  IF NEW.deposit_speed NOT IN ('sangat_cepat','cepat','lama','sangat_lama') THEN
    RAISE EXCEPTION 'Invalid deposit_speed value';
  END IF;

  IF NEW.withdraw_speed NOT IN ('sangat_cepat','cepat','lama','sangat_lama') THEN
    RAISE EXCEPTION 'Invalid withdraw_speed value';
  END IF;

  IF NEW.cs_service NOT IN ('ramah','sangat_ramah','buruk','sangat_buruk') THEN
    RAISE EXCEPTION 'Invalid cs_service value';
  END IF;

  IF NEW.togel_experience NOT IN ('sangat_nyaman','nyaman','tidak_nyaman','tidak_bermain') THEN
    RAISE EXCEPTION 'Invalid togel_experience value';
  END IF;

  IF NEW.slot_experience NOT IN ('jackpot_terus','lancar','rungkad','sering_gangguan','tidak_bermain') THEN
    RAISE EXCEPTION 'Invalid slot_experience value';
  END IF;

  IF NEW.casino_experience NOT IN ('jackpot_terus','lancar','rungkad','sering_gangguan','tidak_bermain') THEN
    RAISE EXCEPTION 'Invalid casino_experience value';
  END IF;

  IF NEW.access_ease NOT IN ('mudah_lancar','loading_cepat','sering_lambat','tidak_bisa') THEN
    RAISE EXCEPTION 'Invalid access_ease value';
  END IF;

  IF NEW.would_recommend NOT IN ('pasti','sudah','belum_tahu','tidak_akan') THEN
    RAISE EXCEPTION 'Invalid would_recommend value';
  END IF;

  IF NEW.data_security NOT IN ('aman','sangat_aman','tidak_aman','sangat_tidak_aman') THEN
    RAISE EXCEPTION 'Invalid data_security value';
  END IF;

  IF NEW.withdraw_issue NOT IN ('tidak_ada','rekening_invalid','sering_pending','lama_proses') THEN
    RAISE EXCEPTION 'Invalid withdraw_issue value';
  END IF;

  IF NEW.preferred_cs_media NOT IN ('whatsapp','telegram','livechat','instagram') THEN
    RAISE EXCEPTION 'Invalid preferred_cs_media value';
  END IF;

  -- Validate overall_rating range
  IF NEW.overall_rating < 0 OR NEW.overall_rating > 5 THEN
    RAISE EXCEPTION 'Invalid overall_rating value';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_response_before_insert
  BEFORE INSERT ON public.responses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_response();
