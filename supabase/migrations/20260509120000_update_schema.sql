-- 1. Adicionar papel 'admin' ao enum existente
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'admin') THEN
    ALTER TYPE public.app_role ADD VALUE 'admin';
  END IF;
END $$;

-- 2. Atualizar a tabela transports com os novos campos solicitados
ALTER TABLE public.transports 
  ADD COLUMN IF NOT EXISTS pickup_location TEXT,      -- Local de retirada
  ADD COLUMN IF NOT EXISTS order_number TEXT,        -- Número do pedido
  ADD COLUMN IF NOT EXISTS pickup_description TEXT,  -- Descrição da retirada
  ADD COLUMN IF NOT EXISTS quantity NUMERIC,         -- Quantidade
  ADD COLUMN IF NOT EXISTS unit_type TEXT,           -- Tipo: container, palete, Bag, outros
  ADD COLUMN IF NOT EXISTS delivery_location TEXT,   -- Local de entrega
  ADD COLUMN IF NOT EXISTS contact_name TEXT,        -- Nome do responsável
  ADD COLUMN IF NOT EXISTS driver_document TEXT;     -- Número de documento

-- 3. Políticas de Segurança para o Administrador (RLS)
-- Permite que o admin veja e gerencie todos os transportes
CREATE POLICY "Admin gerencia todos os transportes"
  ON public.transports FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permite que o admin veja todos os perfis e motoristas
CREATE POLICY "Admin vê todos os perfis"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin vê todos os motoristas"
  ON public.drivers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));