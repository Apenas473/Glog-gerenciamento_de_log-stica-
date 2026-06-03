-- Enum de papéis
CREATE TYPE public.app_role AS ENUM ('cliente', 'transportadora', 'motorista');

-- Enum de status do transporte
CREATE TYPE public.transport_status AS ENUM ('em_espera', 'em_transporte', 'entregue');

-- Tabela profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles selecionáveis pelo dono"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles atualizáveis pelo dono"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles inseríveis pelo dono"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tabela user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê seu próprio papel"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Função has_role (security definer para evitar recursão de RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger para criar profile + role automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone'
  );

  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'cliente');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela drivers (cadastro do motorista pela transportadora ou autocadastro)
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  truck_model TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorista vê seu próprio cadastro"
  ON public.drivers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Transportadora vê todos motoristas"
  ON public.drivers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'transportadora'));

CREATE POLICY "Motorista cria seu cadastro"
  ON public.drivers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'motorista'));

CREATE POLICY "Motorista atualiza seu cadastro"
  ON public.drivers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Função utilitária para gerar código aleatório
CREATE OR REPLACE FUNCTION public.gen_short_code()
RETURNS TEXT
LANGUAGE SQL
VOLATILE
AS $$
  SELECT lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

-- Tabela transports
CREATE TABLE public.transports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  address TEXT NOT NULL,
  cargo TEXT NOT NULL,
  status public.transport_status NOT NULL DEFAULT 'em_espera',
  pickup_code TEXT NOT NULL DEFAULT public.gen_short_code(),
  delivery_code TEXT NOT NULL DEFAULT public.gen_short_code(),
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transports ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Cliente vê seus transportes"
  ON public.transports FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Transportadora vê todos transportes"
  ON public.transports FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'transportadora'));

CREATE POLICY "Motorista vê seus transportes"
  ON public.transports FOR SELECT
  TO authenticated
  USING (auth.uid() = driver_id);

-- INSERT (somente cliente cria pedido para si)
CREATE POLICY "Cliente cria transporte"
  ON public.transports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id AND public.has_role(auth.uid(), 'cliente'));

-- UPDATE: transportadora pode tudo; motorista pode atualizar somente os seus
CREATE POLICY "Transportadora atualiza transportes"
  ON public.transports FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'transportadora'));

CREATE POLICY "Motorista atualiza seus transportes"
  ON public.transports FOR UPDATE
  TO authenticated
  USING (auth.uid() = driver_id AND public.has_role(auth.uid(), 'motorista'));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER transports_updated_at
  BEFORE UPDATE ON public.transports
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Realtime
ALTER TABLE public.transports REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transports;