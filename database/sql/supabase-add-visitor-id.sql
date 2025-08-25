-- =====================================================
-- ADICIONAR COLUNA visitor_id - LIBRA CRÉDITO
-- =====================================================
-- Este script adiciona a coluna visitor_id na tabela simulacoes
-- e cria um índice para otimizar buscas.

-- Verificar e adicionar coluna visitor_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'simulacoes'
        AND column_name = 'visitor_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.simulacoes ADD COLUMN visitor_id UUID;
        RAISE NOTICE 'Coluna visitor_id adicionada à tabela simulacoes';
    ELSE
        RAISE NOTICE 'Coluna visitor_id já existe na tabela simulacoes';
    END IF;
END
$$;

-- Criar índice para visitor_id
CREATE INDEX IF NOT EXISTS idx_simulacoes_visitor_id ON public.simulacoes(visitor_id);
