-- =====================================================
-- ADICIONAR COLUNAS FALTANTES - LIBRA CRÉDITO
-- =====================================================
-- Execute este script ANTES do supabase-security-fixes.sql
-- se houver erros de coluna não encontrada
--
-- ✅ Adiciona coluna integrado_crm na tabela simulacoes
-- ✅ Adiciona outras colunas que possam estar faltando
-- ✅ Verifica se as colunas já existem antes de adicionar

-- =====================================================
-- 1. VERIFICAR E ADICIONAR COLUNA integrado_crm
-- =====================================================

-- Verificar e adicionar coluna integrado_crm se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simulacoes' 
        AND column_name = 'integrado_crm'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.simulacoes ADD COLUMN integrado_crm BOOLEAN DEFAULT false;
        RAISE NOTICE 'Coluna integrado_crm adicionada à tabela simulacoes';
    ELSE
        RAISE NOTICE 'Coluna integrado_crm já existe na tabela simulacoes';
    END IF;
END
$$;

-- =====================================================
-- 2. VERIFICAR E ADICIONAR OUTRAS COLUNAS NECESSÁRIAS
-- =====================================================

-- Verificar e adicionar coluna imovel_proprio se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'simulacoes' 
        AND column_name = 'imovel_proprio'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.simulacoes ADD COLUMN imovel_proprio TEXT CHECK (imovel_proprio IN ('proprio', 'terceiro'));
        RAISE NOTICE 'Coluna imovel_proprio adicionada à tabela simulacoes';
    ELSE
        RAISE NOTICE 'Coluna imovel_proprio já existe na tabela simulacoes';
    END IF;
END
$$;

-- =====================================================
-- 3. VERIFICAR ESTRUTURA ATUAL DA TABELA
-- =====================================================

-- Verificar todas as colunas da tabela simulacoes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'simulacoes' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 4. COMENTÁRIOS
-- =====================================================

COMMENT ON COLUMN public.simulacoes.integrado_crm IS 'Indica se a simulação foi integrada com o CRM';
COMMENT ON COLUMN public.simulacoes.imovel_proprio IS 'Tipo de propriedade do imóvel (proprio ou terceiro)';

-- =====================================================
-- ✅ COLUNAS VERIFICADAS E ADICIONADAS
-- =====================================================

SELECT 
    '✅ Verificação de colunas concluída!' as status,
    'Colunas faltantes foram adicionadas se necessário' as resultado,
    'Agora você pode executar supabase-security-fixes.sql' as proximo_passo;

-- =====================================================
-- 📋 PRÓXIMOS PASSOS:
-- =====================================================
-- 
-- 1. ✅ Execute este script primeiro
-- 2. 🔒 Execute supabase-security-fixes.sql em seguida
-- 3. 📊 Verifique o Database Linter para confirmar
-- 
-- =====================================================