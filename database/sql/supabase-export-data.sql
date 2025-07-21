-- =====================================================
-- EXPORTAÇÃO DE DADOS - SUPABASE ORIGINAL
-- =====================================================
-- Execute estes comandos no SQL Editor da CONTA ORIGINAL
-- Dashboard → SQL Editor → New Query → Cole um comando por vez → Run
--
-- ✅ Exporta todas as tabelas com dados
-- ✅ Gera comandos INSERT para importação
-- ✅ Preserva estrutura e relacionamentos
-- ✅ Compatível com nova conta

-- =====================================================
-- 1. EXPORTAR SIMULAÇÕES
-- =====================================================
-- Copie o resultado e salve como arquivo .sql

SELECT 
    'INSERT INTO public.simulacoes (id, session_id, nome_completo, email, telefone, cidade, valor_emprestimo, valor_imovel, parcelas, tipo_amortizacao, parcela_inicial, parcela_final, imovel_proprio, ip_address, user_agent, status, integrado_crm, created_at, updated_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L, %L, %s, %s, %s, %L, %s, %s, %L, %L, %L, %L, %s, %L, %L)',
            id, session_id, nome_completo, email, telefone, cidade, 
            valor_emprestimo, valor_imovel, parcelas, tipo_amortizacao,
            COALESCE(parcela_inicial::text, 'NULL'),
            COALESCE(parcela_final::text, 'NULL'),
            imovel_proprio, ip_address, user_agent, status, 
            COALESCE(integrado_crm, false), created_at, updated_at
        ), 
        E',\n'
    ) || ';' as export_simulacoes
FROM public.simulacoes
WHERE created_at IS NOT NULL;

-- =====================================================
-- 2. EXPORTAR USER JOURNEY
-- =====================================================

SELECT 
    'INSERT INTO public.user_journey (id, session_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landing_page, pages_visited, time_on_site, device_info, ip_address, created_at, updated_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %s, %L, %L, %L, %L)',
            id, session_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
            referrer, landing_page, 
            COALESCE(pages_visited::text, '[]'),
            COALESCE(time_on_site, 0),
            COALESCE(device_info::text, 'null'),
            ip_address, created_at, updated_at
        ), 
        E',\n'
    ) || ';' as export_user_journey
FROM public.user_journey
WHERE created_at IS NOT NULL;

-- =====================================================
-- 3. EXPORTAR BLOG POSTS
-- =====================================================

SELECT 
    'INSERT INTO public.blog_posts (id, title, description, category, content, image_url, slug, read_time, published, featured_post, meta_title, meta_description, tags, created_at, updated_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L, %L, %L, %s, %s, %s, %L, %L, %L, %L, %L)',
            id, title, description, category, content, image_url, slug,
            COALESCE(read_time, 5),
            COALESCE(published, false),
            COALESCE(featured_post, false),
            meta_title, meta_description,
            COALESCE(array_to_string(tags, ','), '{}'),
            created_at, updated_at
        ), 
        E',\n'
    ) || ';' as export_blog_posts
FROM public.blog_posts
WHERE created_at IS NOT NULL;

-- =====================================================
-- 4. EXPORTAR POSTS (se existir)
-- =====================================================

-- Verificar se a tabela posts existe primeiro
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts' AND table_schema = 'public') 
        THEN 'Tabela posts encontrada - executar próximo comando'
        ELSE 'Tabela posts não existe - pular para próximo'
    END as status_posts;

-- Se a tabela posts existir, execute este comando:
SELECT 
    'INSERT INTO public.posts (id, title, description, category, image_url, slug, content, read_time, published, featured_post, meta_title, meta_description, tags, created_at, updated_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L, %L, %L, %s, %s, %s, %L, %L, %L, %L, %L)',
            id, title, description, category, image_url, slug, content,
            COALESCE(read_time, 5),
            COALESCE(published, false),
            COALESCE(featured_post, false),
            meta_title, meta_description,
            COALESCE(array_to_string(tags, ','), '{}'),
            created_at, updated_at
        ), 
        E',\n'
    ) || ';' as export_posts
FROM public.posts
WHERE created_at IS NOT NULL;

-- =====================================================
-- 5. EXPORTAR BLOG CATEGORIES
-- =====================================================

SELECT 
    'INSERT INTO public.blog_categories (id, name, description, icon, created_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L)',
            id, name, description, icon, created_at
        ), 
        E',\n'
    ) || 
    ' ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon;' as export_blog_categories
FROM public.blog_categories
WHERE created_at IS NOT NULL;

-- =====================================================
-- 6. EXPORTAR PARCEIROS
-- =====================================================

SELECT 
    'INSERT INTO public.parceiros (id, session_id, nome, email, telefone, cidade, cnpj, tempo_home_equity, perfil_cliente, ramo_atuacao, origem, mensagem, ip_address, user_agent, status, created_at, updated_at) VALUES ' ||
    string_agg(
        format('(%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L)',
            id, session_id, nome, email, telefone, cidade, cnpj,
            tempo_home_equity, perfil_cliente, ramo_atuacao, origem, mensagem,
            ip_address, user_agent, status, created_at, updated_at
        ), 
        E',\n'
    ) || ';' as export_parceiros
FROM public.parceiros
WHERE created_at IS NOT NULL;

-- =====================================================
-- 7. EXPORTAR DATA CLEANUP LOG (se existir)
-- =====================================================

-- Verificar se existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'data_cleanup_log' AND table_schema = 'public') 
        THEN 'Tabela data_cleanup_log encontrada'
        ELSE 'Tabela data_cleanup_log não existe'
    END as status_cleanup_log;

-- Se existir, executar:
SELECT 
    'INSERT INTO public.data_cleanup_log (id, table_name, deleted_count, cleanup_date) VALUES ' ||
    string_agg(
        format('(%L, %L, %s, %L)',
            id, table_name, deleted_count, cleanup_date
        ), 
        E',\n'
    ) || ';' as export_data_cleanup_log
FROM public.data_cleanup_log
WHERE cleanup_date IS NOT NULL;

-- =====================================================
-- 8. CONTAGEM DE REGISTROS PARA VERIFICAÇÃO
-- =====================================================

SELECT 
    'simulacoes' as tabela,
    COUNT(*) as total_registros
FROM public.simulacoes
UNION ALL
SELECT 
    'user_journey' as tabela,
    COUNT(*) as total_registros
FROM public.user_journey
UNION ALL
SELECT 
    'blog_posts' as tabela,
    COUNT(*) as total_registros
FROM public.blog_posts
UNION ALL
SELECT 
    'blog_categories' as tabela,
    COUNT(*) as total_registros
FROM public.blog_categories
UNION ALL
SELECT 
    'parceiros' as tabela,
    COUNT(*) as total_registros
FROM public.parceiros
ORDER BY tabela;

-- =====================================================
-- ✅ INSTRUÇÕES DE EXPORTAÇÃO
-- =====================================================

SELECT 
    '📋 INSTRUÇÕES PARA EXPORTAÇÃO:' as titulo,
    '1. Execute cada comando acima separadamente' as passo1,
    '2. Copie o resultado de cada comando' as passo2,
    '3. Salve cada resultado em arquivo .sql separado' as passo3,
    '4. Exemplo: simulacoes_export.sql, user_journey_export.sql, etc.' as passo4,
    '5. Execute os arquivos na nova conta na ordem correta' as passo5;

-- =====================================================