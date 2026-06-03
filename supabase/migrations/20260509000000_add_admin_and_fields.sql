-- 1. ADICIONAR O PAPEL 'ADMIN' AO ENUM EXISTENTE
-- Usamos um bloco DO para evitar erros caso o valor já exista
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'admin') THEN
    ALTER TYPE public.app_role ADD VALUE 'admin';
  END IF;
END $$;

-- 2. ATUALIZAR A TABELA 'TRANSPORTS' COM OS NOVOS CAMPOS
ALTER TABLE public.transports 
  ADD COLUMN IF NOT EXISTS pickup_location TEXT,          -- Local de retirada
  ADD COLUMN IF NOT EXISTS order_number TEXT,            -- Número do pedido
  ADD COLUMN IF NOT EXISTS pickup_description TEXT,      -- Descrição da retirada
  ADD COLUMN IF NOT EXISTS quantity NUMERIC,             -- Quantidade
  ADD COLUMN IF NOT EXISTS unit_type TEXT,               -- Tipo: container, palete, Bag, outros
  ADD COLUMN IF NOT EXISTS delivery_location TEXT,       -- Local de entrega
  ADD COLUMN IF NOT EXISTS contact_name TEXT,            -- Nome do responsável
  ADD COLUMN IF NOT EXISTS driver_document TEXT;         -- Número de documento do motorista

-- 3. CRIAR POLÍTICAS DE ACESSO PARA O ADMIN (RLS)
-- O Admin possui acesso total a todas as tabelas principais

-- Acesso total aos transportes
CREATE POLICY "Admin possui acesso total de gerenciamento"
  ON public.transports FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Acesso de leitura a perfis e motoristas
CREATE POLICY "Admin visualiza todos os perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin visualiza todos os motoristas"
  ON public.drivers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));