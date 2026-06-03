-- Fix search_path em gen_short_code e touch_updated_at
CREATE OR REPLACE FUNCTION public.gen_short_code()
RETURNS TEXT
LANGUAGE SQL
VOLATILE
SET search_path = public
AS $$
  SELECT lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Revogar EXECUTE público das funções SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;