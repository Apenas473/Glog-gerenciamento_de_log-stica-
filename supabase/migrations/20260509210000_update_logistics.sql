-- 1. Adicionar o papel 'admin' ao ENUM de papéis
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- 2. Adicionar novos campos à tabela 'transports'
ALTER TABLE public.transports 
  ADD COLUMN IF NOT EXISTS pickup_location TEXT,      -- Local de retirada
  ADD COLUMN IF NOT EXISTS order_number TEXT,        -- Número do pedido
  ADD COLUMN IF NOT EXISTS pickup_description TEXT,  -- Descrição da retirada
  ADD COLUMN IF NOT EXISTS quantity NUMERIC,         -- Quantidade
  ADD COLUMN IF NOT EXISTS unit_type TEXT,           -- Tipo: container, palete, Bag, outros
  ADD COLUMN IF NOT EXISTS delivery_location TEXT,   -- Local de entrega
  ADD COLUMN IF NOT EXISTS contact_name TEXT,        -- Nome do responsável
  ADD COLUMN IF NOT EXISTS driver_document TEXT;     -- Número de documento

-- 3. Políticas de Segurança (RLS) para o Administrador
-- O Admin pode visualizar e gerenciar todos os dados
CREATE POLICY "Admin total access" 
  ON public.transports FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin view all profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin view all drivers" 
  ON public.drivers FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));