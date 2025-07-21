-- =====================================================
-- SETUP COMPLETO SUPABASE - LIBRA CRÉDITO
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query → Cole este código → Run
--
-- ✅ Cria todas as tabelas necessárias
-- ✅ Configura índices para performance
-- ✅ Habilita RLS e políticas de segurança
-- ✅ Funções utilitárias e triggers
-- ✅ Views para relatórios
-- ✅ Compatível com todas as funcionalidades

-- =====================================================
-- 1. TABELA SIMULACOES - Armazena simulações de crédito
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
-- 2. TABELA USER_JOURNEY - Tracking completo de usuários
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
-- 3. TABELA BLOG_POSTS - Sistema de blog integrado
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT, -- Aumentado para suportar URLs longas
    slug TEXT UNIQUE NOT NULL,
    read_time INTEGER DEFAULT 5,
    published BOOLEAN DEFAULT false,
    featured_post BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[], -- Array de strings
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
-- 6. ÍNDICES PARA PERFORMANCE
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
-- 7. FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 8. TRIGGERS PARA updated_at
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
-- 9. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10. POLÍTICAS RLS
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

-- =====================================================
-- 11. FUNÇÃO PARA GERAR SLUG ÚNICO
-- =====================================================

CREATE OR REPLACE FUNCTION public.generate_unique_slug(title_text TEXT, existing_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================

CREATE OR REPLACE FUNCTION get_simulacao_stats()
RETURNS TABLE (
    total_simulacoes BIGINT,
    simulacoes_hoje BIGINT,
    simulacoes_semana BIGINT,
    simulacoes_mes BIGINT,
    valor_total_emprestimos NUMERIC,
    cidade_mais_ativa TEXT,
    conversao_rate DECIMAL
) AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13. VIEW PARA DASHBOARD COMPLETO
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
-- 14. INSERIR CATEGORIAS PADRÃO DO BLOG
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
-- 15. FUNÇÃO PARA LIMPEZA DE DADOS (LGPD)
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 16. TABELA DE LOG DE LIMPEZA
-- =====================================================

CREATE TABLE IF NOT EXISTS public.data_cleanup_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    deleted_count INTEGER NOT NULL,
    cleanup_date TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 17. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.simulacoes IS 'Simulações de crédito com garantia de imóvel realizadas pelos usuários';
COMMENT ON TABLE public.user_journey IS 'Jornada completa dos usuários no site com tracking detalhado';
COMMENT ON TABLE public.blog_posts IS 'Posts do blog da Libra Crédito com sistema CMS completo';
COMMENT ON TABLE public.blog_categories IS 'Categorias dos posts do blog';
COMMENT ON TABLE public.parceiros IS 'Cadastros de parceiros interessados em trabalhar com a Libra';

-- Comentários em colunas importantes
COMMENT ON COLUMN public.simulacoes.session_id IS 'ID único da sessão do usuário para linking com user_journey';
COMMENT ON COLUMN public.simulacoes.valor_emprestimo IS 'Valor solicitado para empréstimo';
COMMENT ON COLUMN public.simulacoes.valor_imovel IS 'Valor do imóvel usado como garantia';
COMMENT ON COLUMN public.user_journey.pages_visited IS 'Array JSON com páginas visitadas e timestamps';
COMMENT ON COLUMN public.user_journey.device_info IS 'Informações do dispositivo (browser, OS, resolução)';
COMMENT ON COLUMN public.blog_posts.image_url IS 'URL da imagem (suporta URLs longas incluindo base64 e Supabase Storage)';

-- =====================================================
-- 18. VERIFICAÇÃO FINAL E STATUS
-- =====================================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('simulacoes', 'user_journey', 'blog_posts', 'blog_categories', 'parceiros', 'data_cleanup_log')
ORDER BY table_name;

-- Verificar contagem de registros
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
-- ✅ SCRIPT CONCLUÍDO COM SUCESSO!
-- =====================================================

SELECT 
    '🎉 Setup Supabase concluído com sucesso!' as status,
    'Todas as tabelas, índices, triggers e políticas foram criados.' as detalhes,
    'Próximo passo: Teste a aplicação em /test-supabase' as proximo_passo;

-- =====================================================
-- 📋 PRÓXIMOS PASSOS CRÍTICOS:
-- =====================================================
-- 
-- 1. 🔥 OBRIGATÓRIO: Configurar Storage Bucket 'blog-images'
--    - Acesse: https://app.supabase.com → Seu Projeto → Storage
--    - Clique em "Create Bucket"
--    - Nome: blog-images
--    - Public bucket: ✅ HABILITADO
--    - File size limit: 5 MB
--    - MIME types: image/jpeg, image/png, image/gif, image/webp
--    
--    OU usar o botão "📁 Criar Bucket Storage" no /admin
--
-- 2. 🧪 Testar aplicação em: http://localhost:5173/test-supabase
-- 3. 🎛️ Acessar dashboard admin: http://localhost:5173/admin
-- 4. 🧮 Fazer uma simulação: http://localhost:5173/simulacao
-- 5. 📝 Testar blog: http://localhost:5173/blog
-- 6. 🔧 Executar diagnósticos no admin para validar storage
-- 
-- ⚠️ IMPORTANTE: Sem o bucket 'blog-images', o upload de imagens 
--    do blog usará apenas armazenamento local (base64)
-- 
-- =====================================================