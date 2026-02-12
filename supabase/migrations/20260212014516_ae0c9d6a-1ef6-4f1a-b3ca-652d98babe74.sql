-- Create a function to submit survey and return response_number
CREATE OR REPLACE FUNCTION public.submit_survey(
  p_user_id text,
  p_whatsapp text,
  p_referral_source text,
  p_referral_other text DEFAULT NULL,
  p_registration_ease text DEFAULT NULL,
  p_deposit_speed text DEFAULT NULL,
  p_withdraw_speed text DEFAULT NULL,
  p_cs_service text DEFAULT NULL,
  p_togel_experience text DEFAULT NULL,
  p_slot_experience text DEFAULT NULL,
  p_casino_experience text DEFAULT NULL,
  p_access_ease text DEFAULT NULL,
  p_would_recommend text DEFAULT NULL,
  p_data_security text DEFAULT NULL,
  p_withdraw_issue text DEFAULT NULL,
  p_preferred_cs_media text DEFAULT NULL,
  p_overall_rating integer DEFAULT 0,
  p_suggestions text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_response_number integer;
BEGIN
  INSERT INTO public.responses (
    user_id, whatsapp, referral_source, referral_other,
    registration_ease, deposit_speed, withdraw_speed, cs_service,
    togel_experience, slot_experience, casino_experience, access_ease,
    would_recommend, data_security, withdraw_issue, preferred_cs_media,
    overall_rating, suggestions
  ) VALUES (
    p_user_id, p_whatsapp, p_referral_source, p_referral_other,
    p_registration_ease, p_deposit_speed, p_withdraw_speed, p_cs_service,
    p_togel_experience, p_slot_experience, p_casino_experience, p_access_ease,
    p_would_recommend, p_data_security, p_withdraw_issue, p_preferred_cs_media,
    p_overall_rating, p_suggestions
  )
  RETURNING response_number INTO v_response_number;

  RETURN v_response_number;
END;
$$;