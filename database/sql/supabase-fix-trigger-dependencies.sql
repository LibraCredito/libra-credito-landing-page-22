-- =====================================================
-- CORRIGIR DEPENDÊNCIAS DE TRIGGERS - LIBRA CRÉDITO
-- =====================================================
-- Execute este script se houver erros de dependência de triggers
-- Dashboard → SQL Editor → New Query → Cole este código → Run
--
-- ✅ Remove triggers dependentes antes de alterar funções
-- ✅ Recria triggers após correção das funções
-- ✅ Resolve erros de "cannot drop function because other objects depend on it"

-- =====================================================
-- 1. LISTAR DEPENDÊNCIAS ATUAIS
-- =====================================================

-- Verificar triggers existentes e suas dependências
SELECT 
    t.trigger_name,
    t.event_object_table as table_name,
    t.action_statement as function_call
FROM information_schema.triggers t
WHERE t.trigger_schema = 'public'
AND t.action_statement LIKE '%update_posts_updated_at%'
ORDER BY t.trigger_name;

-- =====================================================
-- 2. REMOVER TRIGGERS DEPENDENTES SEGUROS
-- =====================================================

-- Remover triggers que dependem de update_posts_updated_at
DROP TRIGGER IF EXISTS posts_updated_at_trigger ON public.posts;
DROP TRIGGER IF EXISTS update_posts_updated_at_trigger ON public.posts;
DROP TRIGGER IF EXISTS posts_update_trigger ON public.posts;
DROP TRIGGER IF EXISTS blog_posts_updated_at_trigger ON public.blog_posts;

-- Verificar outras possíveis dependências
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
        AND action_statement LIKE '%update_posts_updated_at%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 
                      trigger_rec.trigger_name, 
                      trigger_rec.event_object_table);
        RAISE NOTICE 'Removido trigger: % na tabela %', 
                     trigger_rec.trigger_name, 
                     trigger_rec.event_object_table;
    END LOOP;
END
$$;

-- =====================================================
-- 3. CORRIGIR FUNÇÃO COM DEPENDÊNCIAS RESOLVIDAS
-- =====================================================

-- Agora pode remover a função sem problemas
DROP FUNCTION IF EXISTS public.update_posts_updated_at();

-- Recriar função com search_path fixo
CREATE OR REPLACE FUNCTION public.update_posts_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- =====================================================
-- 4. RECRIAR TRIGGERS NECESSÁRIOS
-- =====================================================

-- Recriar trigger para tabela posts (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts' AND table_schema = 'public') THEN
        CREATE TRIGGER posts_updated_at_trigger
            BEFORE UPDATE ON public.posts
            FOR EACH ROW
            EXECUTE FUNCTION public.update_posts_updated_at();
        RAISE NOTICE 'Trigger posts_updated_at_trigger recriado para tabela posts';
    END IF;
END
$$;

-- Recriar trigger para tabela blog_posts (se necessário e existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        -- Verificar se já não existe outro trigger para updated_at
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name LIKE '%blog_posts%updated%' 
            AND event_object_table = 'blog_posts'
        ) THEN
            CREATE TRIGGER blog_posts_updated_at_trigger
                BEFORE UPDATE ON public.blog_posts
                FOR EACH ROW
                EXECUTE FUNCTION public.update_updated_at_column();
            RAISE NOTICE 'Trigger blog_posts_updated_at_trigger recriado';
        END IF;
    END IF;
END
$$;

-- =====================================================
-- 5. VERIFICAÇÕES FINAIS
-- =====================================================

-- Verificar se a função foi corrigida
SELECT 
    routine_name,
    routine_type,
    security_type,
    routine_definition LIKE '%search_path%' as has_search_path
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'update_posts_updated_at';

-- Verificar triggers recriados
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND (trigger_name LIKE '%posts%updated%' OR action_statement LIKE '%update_posts_updated_at%')
ORDER BY trigger_name;

-- =====================================================
-- ✅ DEPENDÊNCIAS CORRIGIDAS
-- =====================================================

SELECT 
    '🔧 Dependências de triggers corrigidas!' as status,
    'Função update_posts_updated_at corrigida com search_path fixo' as funcao_status,
    'Triggers recriados conforme necessário' as trigger_status;

-- =====================================================
-- 📋 O QUE FOI FEITO:
-- =====================================================
-- 
-- 1. ✅ Listadas dependências de triggers
-- 2. ✅ Removidos triggers que dependiam da função
-- 3. ✅ Função update_posts_updated_at corrigida com search_path fixo
-- 4. ✅ Triggers recriados com a função corrigida
-- 5. ✅ Verificações finais realizadas
-- 
-- Agora você pode executar supabase-security-fixes.sql sem erros
-- 
-- =====================================================