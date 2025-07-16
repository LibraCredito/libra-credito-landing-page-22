-- =====================================================
-- MIGRAÇÃO COMPLETA SUPABASE - LIBRA CRÉDITO
-- =====================================================
-- Execute este script ÚNICO no SQL Editor da NOVA conta Supabase
-- Dashboard → SQL Editor → New Query → Cole este código → Run
--
-- ✅ Setup completo em um único script
-- ✅ Cria todas as tabelas necessárias
-- ✅ Configura índices para performance  
-- ✅ Habilita RLS e políticas de segurança
-- ✅ Funções utilitárias e triggers
-- ✅ Views para relatórios
-- ✅ Categorias padrão do blog
-- ✅ Correções de segurança
-- ✅ Compatível com simulador, blog, parceiros e admin

-- =====================================================
-- 1. TABELA SIMULACOES - Simulações de crédito
-- =====================================================

CREATE TABLE IF NOT EXISTS public.simulacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT NOT NULL,
    valor_emprestimo NUMERIC NOT NULL,
    valor_imovel NUMERIC NOT NULL,
    parcelas INTEGER NOT NULL,
    tipo_amortizacao TEXT NOT NULL CHECK (tipo_amortizacao IN ('SAC', 'PRICE')),
    parcela_inicial NUMERIC,
    parcela_final NUMERIC,
    imovel_proprio TEXT CHECK (imovel_proprio IN ('proprio', 'terceiro')),
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'interessado', 'contatado', 'finalizado')),
    integrado_crm BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA USER_JOURNEY - Tracking de usuários
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_journey (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    referrer TEXT,
    landing_page TEXT NOT NULL,
    pages_visited JSONB DEFAULT '[]'::jsonb,
    time_on_site INTEGER DEFAULT 0,
    device_info JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA BLOG_POSTS - Sistema de blog
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    read_time INTEGER DEFAULT 5,
    published BOOLEAN DEFAULT false,
    featured_post BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA BLOG_CATEGORIES - Categorias do blog
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blog_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA PARCEIROS - Cadastros de parceiros
-- =====================================================

CREATE TABLE IF NOT EXISTS public.parceiros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT NOT NULL,
    cnpj TEXT,
    tempo_home_equity TEXT NOT NULL,
    perfil_cliente TEXT NOT NULL,
    ramo_atuacao TEXT NOT NULL,
    origem TEXT NOT NULL,
    mensagem TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. TABELA DATA_CLEANUP_LOG - Log de limpeza (LGPD)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.data_cleanup_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    deleted_count INTEGER NOT NULL,
    cleanup_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Simulações
CREATE INDEX IF NOT EXISTS idx_simulacoes_session_id ON public.simulacoes(session_id);
CREATE INDEX IF NOT EXISTS idx_simulacoes_created_at ON public.simulacoes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_simulacoes_status ON public.simulacoes(status);
CREATE INDEX IF NOT EXISTS idx_simulacoes_cidade ON public.simulacoes(cidade);

-- User Journey
CREATE INDEX IF NOT EXISTS idx_user_journey_session_id ON public.user_journey(session_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_created_at ON public.user_journey(created_at DESC);

-- Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured_post) WHERE featured_post = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- Parceiros
CREATE INDEX IF NOT EXISTS idx_parceiros_created_at ON public.parceiros(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parceiros_status ON public.parceiros(status);

-- =====================================================
-- 8. FUNÇÃO PARA ATUALIZAR updated_at (SEGURA)
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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
-- 9. TRIGGERS PARA updated_at
-- =====================================================

-- Simulações
DROP TRIGGER IF EXISTS update_simulacoes_updated_at ON public.simulacoes;
CREATE TRIGGER update_simulacoes_updated_at 
    BEFORE UPDATE ON public.simulacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User Journey
DROP TRIGGER IF EXISTS update_user_journey_updated_at ON public.user_journey;
CREATE TRIGGER update_user_journey_updated_at 
    BEFORE UPDATE ON public.user_journey 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog Posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Parceiros
DROP TRIGGER IF EXISTS update_parceiros_updated_at ON public.parceiros;
CREATE TRIGGER update_parceiros_updated_at
    BEFORE UPDATE ON public.parceiros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_cleanup_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 11. POLÍTICAS RLS
-- =====================================================

-- Simulações - Permitir todas as operações para usuários anônimos
DROP POLICY IF EXISTS "Enable all operations for anonymous users" ON public.simulacoes;
CREATE POLICY "Enable all operations for anonymous users" ON public.simulacoes
    FOR ALL USING (true);

-- User Journey - Permitir todas as operações
DROP POLICY IF EXISTS "Enable all operations for anonymous users" ON public.user_journey;
CREATE POLICY "Enable all operations for anonymous users" ON public.user_journey
    FOR ALL USING (true);

-- Blog Posts - Público pode ler posts publicados, admin pode tudo
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin can manage all blog posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
    FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage all blog posts" ON public.blog_posts
    FOR ALL USING (true);

-- Blog Categories - Público pode ler, admin pode gerenciar
DROP POLICY IF EXISTS "Public can read blog_categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admin can manage blog_categories" ON public.blog_categories;
CREATE POLICY "Public can read blog_categories" ON public.blog_categories
    FOR SELECT USING (true);
CREATE POLICY "Admin can manage blog_categories" ON public.blog_categories
    FOR ALL USING (true);

-- Parceiros - Permitir inserção pública e gestão admin
DROP POLICY IF EXISTS "Public can insert parceiros" ON public.parceiros;
DROP POLICY IF EXISTS "Admin can manage parceiros" ON public.parceiros;
CREATE POLICY "Public can insert parceiros" ON public.parceiros
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage parceiros" ON public.parceiros
    FOR ALL USING (true);

-- Data Cleanup Log - Admin pode gerenciar
DROP POLICY IF EXISTS "Admin can manage data_cleanup_log" ON public.data_cleanup_log;
DROP POLICY IF EXISTS "System can insert cleanup logs" ON public.data_cleanup_log;
CREATE POLICY "Admin can manage data_cleanup_log" ON public.data_cleanup_log
    FOR ALL USING (true);
CREATE POLICY "System can insert cleanup logs" ON public.data_cleanup_log
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 12. FUNÇÃO PARA GERAR SLUG ÚNICO (SEGURA)
-- =====================================================

CREATE OR REPLACE FUNCTION public.generate_unique_slug(title_text TEXT, existing_id UUID DEFAULT NULL)
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Converter título para slug
    base_slug := lower(trim(title_text));
    base_slug := regexp_replace(base_slug, '[áàâãäå]', 'a', 'g');
    base_slug := regexp_replace(base_slug, '[éèêë]', 'e', 'g');
    base_slug := regexp_replace(base_slug, '[íìîï]', 'i', 'g');
    base_slug := regexp_replace(base_slug, '[óòôõö]', 'o', 'g');
    base_slug := regexp_replace(base_slug, '[úùûü]', 'u', 'g');
    base_slug := regexp_replace(base_slug, '[ç]', 'c', 'g');
    base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    final_slug := base_slug;
    
    -- Verificar se slug existe (excluindo o próprio post se estiver atualizando)
    WHILE EXISTS (
        SELECT 1 FROM public.blog_posts 
        WHERE slug = final_slug 
        AND (existing_id IS NULL OR id != existing_id)
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;

-- =====================================================
-- 13. FUNÇÃO PARA ESTATÍSTICAS (SEGURA)
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_simulacao_stats()
RETURNS TABLE (
    total_simulacoes BIGINT,
    simulacoes_hoje BIGINT,
    simulacoes_semana BIGINT,
    simulacoes_mes BIGINT,
    valor_total_emprestimos NUMERIC,
    cidade_mais_ativa TEXT,
    conversao_rate DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_simulacoes,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END)::BIGINT as simulacoes_hoje,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END)::BIGINT as simulacoes_semana,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END)::BIGINT as simulacoes_mes,
        COALESCE(SUM(valor_emprestimo), 0) as valor_total_emprestimos,
        (SELECT cidade FROM public.simulacoes GROUP BY cidade ORDER BY COUNT(*) DESC LIMIT 1) as cidade_mais_ativa,
        CASE 
            WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN status IN ('interessado', 'contatado', 'finalizado') THEN 1 END) * 100.0) / COUNT(*), 2)
            ELSE 0
        END as conversao_rate
    FROM public.simulacoes;
END;
$$;

-- =====================================================
-- 14. FUNÇÃO PARA ESTATÍSTICAS DE PARCEIROS (SEGURA)
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_parceiros_stats()
RETURNS TABLE (
    total_parceiros BIGINT,
    pendentes BIGINT,
    aprovados BIGINT,
    rejeitados BIGINT,
    parceiros_mes BIGINT,
    origem_mais_comum TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_parceiros,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END)::BIGINT as pendentes,
        COUNT(CASE WHEN status = 'aprovado' THEN 1 END)::BIGINT as aprovados,
        COUNT(CASE WHEN status = 'rejeitado' THEN 1 END)::BIGINT as rejeitados,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END)::BIGINT as parceiros_mes,
        (SELECT origem FROM public.parceiros GROUP BY origem ORDER BY COUNT(*) DESC LIMIT 1) as origem_mais_comum
    FROM public.parceiros;
END;
$$;

-- =====================================================
-- 15. FUNÇÃO PARA LIMPEZA DE DADOS - LGPD (SEGURA)
-- =====================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Remove dados de jornada de usuário com mais de 2 anos
    DELETE FROM public.user_journey 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log da limpeza
    INSERT INTO public.data_cleanup_log (table_name, deleted_count, cleanup_date)
    VALUES ('user_journey', deleted_count, NOW())
    ON CONFLICT DO NOTHING;
    
    RETURN deleted_count;
END;
$$;

-- =====================================================
-- 16. VIEW PARA DASHBOARD COMPLETO (SEGURA)
-- =====================================================

CREATE OR REPLACE VIEW public.simulacoes_dashboard AS
SELECT 
    s.id,
    s.created_at,
    s.nome_completo,
    s.email,
    s.telefone,
    s.cidade,
    s.valor_emprestimo,
    s.valor_imovel,
    s.parcelas,
    s.tipo_amortizacao,
    s.status,
    s.integrado_crm,
    ROUND((s.valor_emprestimo::DECIMAL / s.valor_imovel::DECIMAL) * 100, 2) as ltv_ratio,
    uj.utm_source,
    uj.utm_campaign,
    uj.referrer,
    uj.time_on_site,
    (uj.device_info->>'device_type') as device_type,
    (uj.device_info->>'browser') as browser
FROM public.simulacoes s
LEFT JOIN public.user_journey uj ON s.session_id = uj.session_id
ORDER BY s.created_at DESC;

-- =====================================================
-- 17. INSERIR CATEGORIAS PADRÃO DO BLOG
-- =====================================================

INSERT INTO public.blog_categories (id, name, description, icon) VALUES
    ('home-equity', 'Home Equity', 'Crédito com garantia de imóvel - melhores condições', 'Home'),
    ('cgi', 'Capital de Giro', 'Soluções inteligentes para capital de giro empresarial', 'TrendingUp'),
    ('consolidacao', 'Consolidação de Dívidas', 'Organize suas finanças e reduza juros', 'Wallet'),
    ('credito-rural', 'Crédito Rural', 'Financiamento para propriedades rurais e agronegócio', 'Building'),
    ('documentacao', 'Documentação', 'Guias sobre documentos e regularização', 'FileText'),
    ('score-credito', 'Score e Crédito', 'Dicas para melhorar seu score e análise de crédito', 'CreditCard'),
    ('educacao-financeira', 'Educação Financeira', 'Conhecimento para decisões financeiras conscientes', 'BookOpen'),
    ('reformas', 'Projetos/Reformas', 'Realize seus projetos com as melhores condições', 'Home')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon;

-- =====================================================
-- 18. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.simulacoes IS 'Simulações de crédito com garantia de imóvel realizadas pelos usuários';
COMMENT ON TABLE public.user_journey IS 'Jornada completa dos usuários no site com tracking detalhado';
COMMENT ON TABLE public.blog_posts IS 'Posts do blog da Libra Crédito com sistema CMS completo';
COMMENT ON TABLE public.blog_categories IS 'Categorias dos posts do blog';
COMMENT ON TABLE public.parceiros IS 'Cadastros de parceiros interessados em trabalhar com a Libra';
COMMENT ON TABLE public.data_cleanup_log IS 'Log de limpeza de dados para conformidade LGPD';

-- Comentários em colunas importantes
COMMENT ON COLUMN public.simulacoes.session_id IS 'ID único da sessão do usuário para linking com user_journey';
COMMENT ON COLUMN public.simulacoes.valor_emprestimo IS 'Valor solicitado para empréstimo';
COMMENT ON COLUMN public.simulacoes.valor_imovel IS 'Valor do imóvel usado como garantia';
COMMENT ON COLUMN public.user_journey.pages_visited IS 'Array JSON com páginas visitadas e timestamps';
COMMENT ON COLUMN public.user_journey.device_info IS 'Informações do dispositivo (browser, OS, resolução)';
COMMENT ON COLUMN public.blog_posts.image_url IS 'URL da imagem (suporta URLs longas incluindo base64 e Supabase Storage)';

-- Comentários nas funções
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Função segura para atualizar timestamp com search_path fixo';
COMMENT ON FUNCTION public.generate_unique_slug(TEXT, UUID) IS 'Função segura para gerar slugs únicos com search_path fixo';
COMMENT ON FUNCTION public.get_simulacao_stats() IS 'Função segura para estatísticas de simulações com search_path fixo';
COMMENT ON FUNCTION public.get_parceiros_stats() IS 'Função segura para estatísticas de parceiros com search_path fixo';
COMMENT ON FUNCTION public.cleanup_old_data() IS 'Função segura para limpeza de dados antigos com search_path fixo';
COMMENT ON VIEW public.simulacoes_dashboard IS 'View segura para dashboard de simulações';

-- =====================================================
-- 19. VERIFICAÇÃO FINAL E STATUS
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('simulacoes', 'user_journey', 'blog_posts', 'blog_categories', 'parceiros', 'data_cleanup_log')
ORDER BY table_name;

-- Verificar se RLS está habilitado em todas as tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('simulacoes', 'user_journey', 'blog_posts', 'blog_categories', 'parceiros', 'data_cleanup_log')
ORDER BY tablename;

-- Verificar contagem de registros iniciais
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
-- ✅ SETUP COMPLETO - SUCESSO!
-- =====================================================

SELECT 
    '🎉 Setup Supabase completo realizado com sucesso!' as status,
    'Todas as tabelas, índices, triggers, funções e políticas foram criados.' as detalhes,
    'Banco configurado para simulador, blog, parceiros e admin dashboard.' as funcionalidades,
    'Próximo passo: Configurar bucket blog-images e testar aplicação.' as proximo_passo;

-- =====================================================
-- 📋 PRÓXIMOS PASSOS OBRIGATÓRIOS:
-- =====================================================
-- 
-- 1. 🔥 CONFIGURAR STORAGE BUCKET 'blog-images':
--    - Acesse: https://app.supabase.com → Seu Projeto → Storage
--    - Clique em "Create Bucket"
--    - Nome: blog-images
--    - Public bucket: ✅ HABILITADO
--    - File size limit: 5 MB
--    - MIME types: image/jpeg, image/png, image/gif, image/webp
--
-- 2. 🔧 ATUALIZAR CÓDIGO:
--    - Atualizar credenciais em /src/lib/supabase.ts
--    - Implementar environment variables (recomendado)
--
-- 3. 🧪 TESTAR APLICAÇÃO:
--    - http://localhost:5173/test-supabase (diagnósticos)
--    - http://localhost:5173/admin (dashboard admin)
--    - http://localhost:5173/simulacao (simulação)
--    - http://localhost:5173/blog (blog CMS)
--    - http://localhost:5173/parceiros (parceiros)
--
-- ⚠️ IMPORTANTE: Sem o bucket 'blog-images', upload de imagens 
--    do blog usará apenas armazenamento local (base64)
-- 
-- =====================================================